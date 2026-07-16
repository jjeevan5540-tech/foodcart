import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    doc,
    onSnapshot,
    setDoc,
    collection,
    addDoc,
    updateDoc,
    query,
    where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { sendOrderNotifications, sendPaymentNotification } from '../services/notificationService';

const CartContext = createContext();

// Auto-update order status timeline (in milliseconds)
const STATUS_TIMELINE = [
    { status: 'Preparing', delay: 2 * 60 * 1000 },        // 2 min
    { status: 'Out for Delivery', delay: 7 * 60 * 1000 }, // 7 min
    { status: 'Delivered', delay: 17 * 60 * 1000 },       // 17 min
];

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [favorites, setFavorites] = useState(() => {
        const savedFavs = localStorage.getItem('favorites');
        return savedFavs ? JSON.parse(savedFavs) : [];
    });
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [loadingCart] = useState(false);



    // Sync CartItems with Firestore
    useEffect(() => {
        if (!user) return;

        const mergeGuestCart = async () => {
            const guestCart = localStorage.getItem('foodkart_guest_cart');
            if (guestCart) {
                try {
                    const guestItems = JSON.parse(guestCart);
                    if (guestItems.length > 0) {
                        const cartDocRef = doc(db, 'carts', user.uid);
                        setCartItems(prev => {
                            const combined = [...prev];
                            guestItems.forEach(gItem => {
                                const existing = combined.find(i => Number(i.id) === Number(gItem.id));
                                if (existing) existing.quantity += gItem.quantity;
                                else combined.push(gItem);
                            });
                            setDoc(cartDocRef, { items: combined });
                            return combined;
                        });
                    }
                    localStorage.removeItem('foodkart_guest_cart');
                } catch (e) { console.error(e); }
            }
        };

        const cartDocRef = doc(db, 'carts', user.uid);
        const unsubscribe = onSnapshot(cartDocRef, (docSnap) => {
            if (docSnap.exists()) setCartItems(docSnap.data().items || []);
            else setCartItems([]);
        });

        mergeGuestCart();
        return () => unsubscribe();
    }, [user]);

    // Sync Orders with Firestore + auto-update status
    useEffect(() => {
        if (!user) { setOrders([]); setLoadingOrders(false); return; }

        const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));

        const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
            const ordersList = [];
            querySnapshot.forEach((docSnap) => {
                ordersList.push({ id: docSnap.id, ...docSnap.data() });
            });
            const sortedOrders = ordersList.sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrders(sortedOrders);
            setLoadingOrders(false);

            // Schedule status updates for pending orders
            sortedOrders.forEach(order => {
                if (order.status === 'Pending' || order.status === 'Preparing' || order.status === 'Out for Delivery') {
                    scheduleStatusUpdates(order);
                }
            });
        }, (error) => {
            console.error("Firestore Orders sync error:", error);
            setLoadingOrders(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Schedule automatic order status progression
    const scheduleStatusUpdates = (order) => {
        const orderDate = new Date(order.date).getTime();
        const now = Date.now();

        STATUS_TIMELINE.forEach(({ status, delay }) => {
            const updateTime = orderDate + delay;
            const timeUntilUpdate = updateTime - now;

            // Only schedule future updates for statuses not yet reached
            const statusOrder = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
            const currentIdx = statusOrder.indexOf(order.status);
            const targetIdx = statusOrder.indexOf(status);

            if (targetIdx > currentIdx && timeUntilUpdate > 0) {
                setTimeout(async () => {
                    try {
                        const orderRef = doc(db, 'orders', order.id);
                        await updateDoc(orderRef, { status });
                        console.log(`✅ Order ${order.id} status updated to: ${status}`);
                    } catch (e) {
                        console.error('Status update error:', e);
                    }
                }, timeUntilUpdate);
            } else if (targetIdx > currentIdx && timeUntilUpdate <= 0) {
                // Already past this time, update immediately
                const orderRef = doc(db, 'orders', order.id);
                updateDoc(orderRef, { status }).catch(console.error);
            }
        });
    };

    // Persist Favorites only
    useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

    // Clear stale localStorage cart keys on mount
    useEffect(() => {
        localStorage.removeItem('cart');
        localStorage.removeItem('foodkart_guest_cart');
    }, []);

    const updateCartData = async (newItems) => {
        if (!user) { setCartItems(newItems); return; }
        try {
            const cartDocRef = doc(db, 'carts', user.uid);
            await setDoc(cartDocRef, { items: newItems });
        } catch (error) { console.error('Error updating Firestore cart:', error); }
    };

    const addToCart = async (item, restaurantName) => {
        const itemId = Number(item.id);
        let newItems;
        const existing = cartItems.find(i => Number(i.id) === itemId);
        if (existing) {
            newItems = cartItems.map(i => Number(i.id) === itemId ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
            newItems = [...cartItems, { ...item, quantity: 1, restaurantName }];
        }
        await updateCartData(newItems);
    };

    const addMultipleToCart = async (items) => {
        let newItems = [...cartItems];
        items.forEach(newItem => {
            const itemId = Number(newItem.id);
            const existing = newItems.find(i => Number(i.id) === itemId);
            if (existing) {
                existing.quantity += newItem.quantity;
            } else {
                newItems.push({ ...newItem });
            }
        });
        await updateCartData(newItems);
    };

    const removeFromCart = async (id) => {
        const newItems = cartItems.filter(item => Number(item.id) !== Number(id));
        await updateCartData(newItems);
    };

    const updateQuantity = async (id, delta) => {
        const newItems = cartItems.map(item => {
            if (Number(item.id) === Number(id)) {
                const newQty = Math.max(0, item.quantity + delta);
                return newQty === 0 ? null : { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean);
        await updateCartData(newItems);
    };

    const clearCart = async () => {
        await updateCartData([]);
        setAppliedOffer(null);
    };

    const applyOffer = (offer) => setAppliedOffer(offer);
    const removeOffer = () => setAppliedOffer(null);

    const placeOrder = async (address, paymentMethod = 'Online Payment') => {
        if (!user) throw new Error("Please log in to place an order");

        const deliveryFee = 40;
        const platformFee = 20;
        const taxes = Math.round(totalAmount * 0.05);
        const grandTotal = totalAmount + deliveryFee + platformFee + taxes;

        const newOrder = {
            userId: user.uid,
            items: cartItems,
            total: grandTotal,
            subtotal: totalAmount,
            date: new Date().toISOString(),
            status: 'Pending',
            address,
            paymentMethod,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone || '',
        };

        try {
            const docRef = await addDoc(collection(db, 'orders'), newOrder);
            const orderWithId = { id: docRef.id, ...newOrder };

            // Send order notifications (email + WhatsApp to customer & restaurant)
            sendOrderNotifications(orderWithId, user).catch(console.warn);

            // Send payment confirmation notification
            sendPaymentNotification(orderWithId, user, paymentMethod).catch(console.warn);

            // Schedule automatic status updates
            scheduleStatusUpdates(orderWithId);

            await clearCart();
            return docRef.id;
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let discount = 0;
    if (appliedOffer) {
        if (appliedOffer.type === 'percentage') {
            discount = Math.round((subtotal * appliedOffer.value) / 100);
            if (appliedOffer.maxDiscount) discount = Math.min(discount, appliedOffer.maxDiscount);
        } else if (appliedOffer.type === 'flat') {
            discount = appliedOffer.value;
        }
    }
    discount = Math.min(discount, subtotal);
    const totalAmount = subtotal - discount;

    // Sync Favorites with Firestore
    useEffect(() => {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.savedRestaurants) {
                    // Ensure all IDs are numbers
                    setFavorites(data.savedRestaurants.map(id => Number(id)));
                }
            }
        });
        return () => unsubscribe();
    }, [user]);

    const toggleFavorite = async (restaurantId) => {
        const id = Number(restaurantId);
        let newFavorites;
        if (favorites.includes(id)) {
            newFavorites = favorites.filter(favId => favId !== id);
        } else {
            newFavorites = [...favorites, id];
        }

        setFavorites(newFavorites);

        if (user) {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, { savedRestaurants: newFavorites });
            } catch (e) {
                // If document doesn't exist, create it (merge true preserves other fields)
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(userDocRef, { savedRestaurants: newFavorites }, { merge: true });
            }
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            addMultipleToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalAmount,
            subtotal,
            discount,
            appliedOffer,
            applyOffer,
            removeOffer,
            placeOrder,
            orders,
            loadingOrders,
            loadingCart,
            favorites,
            toggleFavorite,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
