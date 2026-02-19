import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2, ChevronRight, MapPin, Receipt, ShieldCheck, Info, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { restaurants } from '../data/restaurants';
import CartItem from '../components/CartItem';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, totalItems, totalAmount, subtotal, discount, appliedOffer, applyOffer, removeOffer, clearCart, loadingCart } = useCart();

    if (loadingCart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center mb-8 animate-fade-in">
                    <ShoppingBag className="w-32 h-32 text-gray-300" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Let's find some delicious food!</p>
                <Link to="/" className="btn-primary flex items-center px-8 py-3">
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    // Group items by restaurant
    const groupedItems = cartItems.reduce((acc, item) => {
        const name = item.restaurantName || 'Unknown Restaurant';
        if (!acc[name]) {
            acc[name] = [];
        }
        acc[name].push(item);
        return acc;
    }, {});

    const deliveryFee = 40;
    const platformFee = 20;
    const taxes = Math.round(totalAmount * 0.05);
    const grandTotal = totalAmount + deliveryFee + platformFee + taxes;

    return (
        <div className="container mx-auto px-4 py-8 pb-32">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-primary-600 font-bold"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center"
                >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {Object.entries(groupedItems).map(([restaurantName, items]) => (
                        <div key={restaurantName} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                            <div className="p-4 bg-gray-50 border-b flex items-center">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mr-3">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{restaurantName}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Ordered Items</p>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {items.map(item => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Cooking Instructions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-4 flex items-center">
                            <Info className="w-5 h-5 mr-2 text-primary-500" />
                            Add Cooking Instructions
                        </h3>
                        <textarea
                            placeholder="e.g. Make it spicy, No onions, etc."
                            className="w-full h-24 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Bill Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <Receipt className="w-5 h-5 mr-2 text-primary-600" />
                            Bill Summary
                        </h3>

                        <div className="space-y-4 text-gray-600 mb-6 font-medium">
                            <div className="flex justify-between">
                                <span>Item Total ({totalItems} items)</span>
                                <span>₹{subtotal || 0}</span>
                            </div>

                            {/* Applied Offer Row */}
                            {appliedOffer && (
                                <div className="flex justify-between text-green-600 animate-fade-in">
                                    <span className="flex items-center">
                                        Offer Applied ({appliedOffer.label})
                                        <button
                                            onClick={removeOffer}
                                            className="ml-2 text-xs font-bold text-red-400 hover:text-red-500 underline"
                                        >
                                            Remove
                                        </button>
                                    </span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="flex items-center">
                                    Delivery Fee
                                    <Info className="w-3 h-3 ml-1 text-gray-400" />
                                </span>
                                <span>₹{deliveryFee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>₹{platformFee}</span>
                            </div>
                            <div className="flex justify-between pb-4 border-b">
                                <span>GST and Restaurant Charges</span>
                                <span>₹{taxes || 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-900 font-extrabold text-2xl pt-4">
                                <span>Amount Paid</span>
                                <span>₹{grandTotal || 0}</span>
                            </div>
                        </div>

                        {/* Available Offers Section */}
                        {!appliedOffer && Object.keys(groupedItems).length === 1 && (
                            (() => {
                                const restaurantName = Object.keys(groupedItems)[0];
                                const restaurant = restaurants.find(r => r.name === restaurantName);
                                if (restaurant?.offer) {
                                    const { offer } = restaurant;
                                    const isEligible = subtotal >= (offer.minOrder || 0);

                                    return (
                                        <div className="mb-6 p-4 rounded-xl border-2 border-dashed border-primary-100 bg-primary-50/30">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center text-primary-600 font-bold">
                                                    <Ticket className="w-4 h-4 mr-2" />
                                                    {offer.label}
                                                </div>
                                                <span className="text-[10px] font-bold text-primary-400 font-mono tracking-tighter">
                                                    {offer.code}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3">
                                                {isEligible
                                                    ? `Applied on orders above ₹${offer.minOrder}`
                                                    : `Add ₹${offer.minOrder - subtotal} more to unlock this offer!`}
                                            </p>
                                            <button
                                                disabled={!isEligible}
                                                onClick={() => applyOffer(offer)}
                                                className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${isEligible ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                Apply Offer
                                            </button>
                                        </div>
                                    );
                                }
                                return null;
                            })()
                        )}

                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                            <div className="flex items-start">
                                <ShieldCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-green-800 tracking-tight">CANCELLATION POLICY</p>
                                    <p className="text-[10px] text-green-700 leading-tight mt-1">
                                        Orders cannot be cancelled once packed for delivery. In case of unexpected delay, a refund will be provided.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center rounded-2xl"
                        >
                            Checkout
                            <ChevronRight className="w-6 h-6 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
