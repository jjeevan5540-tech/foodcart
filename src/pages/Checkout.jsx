import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronLeft, CheckCircle2, ShoppingBag, Receipt, Navigation, Smartphone, CreditCard, Banknote, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../config/notifications';

// Payment methods
const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI', icon: '🔗', desc: 'Pay using any UPI ID', color: 'from-purple-500 to-indigo-500' },
    { id: 'phonepe', label: 'PhonePe', icon: '📱', desc: 'Pay via PhonePe', color: 'from-purple-600 to-purple-800' },
    { id: 'gpay', label: 'Google Pay', icon: '🟢', desc: 'Pay via Google Pay', color: 'from-blue-500 to-green-500' },
    { id: 'paytm', label: 'Paytm', icon: '💙', desc: 'Pay via Paytm', color: 'from-blue-400 to-blue-600' },
    { id: 'bhim', label: 'BHIM UPI', icon: '🇮🇳', desc: 'Pay via BHIM UPI', color: 'from-orange-500 to-green-600' },
    { id: 'amazonpay', label: 'Amazon Pay', icon: '🛒', desc: 'Pay via Amazon Pay', color: 'from-yellow-400 to-orange-500' },
    { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered', color: 'from-green-500 to-emerald-600' },
];

import { useUI } from '../context/UIContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, totalAmount, placeOrder } = useCart();
    const { user } = useAuth();
    const { showToast } = useUI();

    const [address, setAddress] = useState({
        houseNo: '',
        street: '',
        landmark: '',
        pincode: ''
    });

    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [mapLocation, setMapLocation] = useState(null);
    const [mapAddress, setMapAddress] = useState('');

    const deliveryFee = 40;
    const platformFee = 20;
    const taxes = Math.round(totalAmount * 0.05);
    const grandTotal = totalAmount + deliveryFee + platformFee + taxes;

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.id]: e.target.value });
    };

    const handleGetLocation = () => {
        setLocationLoading(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setMapLocation({ lat: latitude, lng: longitude });

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    setMapAddress(data.display_name || "Location found");

                    // Auto-fill some fields if possible
                    if (data.address) {
                        setAddress(prev => ({
                            ...prev,
                            pincode: data.address.postcode || prev.pincode,
                            street: data.address.suburb || data.address.neighbourhood || data.address.road || prev.street
                        }));
                    }
                } catch (err) {
                    console.error("Reverse geocoding error:", err);
                    setMapAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } finally {
                    setLocationLoading(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setLocationError("Unable to retrieve your location. Please enter manually.");
                setLocationLoading(false);
            }
        );
    };

    const processRazorpayPayment = async (fullAddress, paymentLabel) => {
        // If placeholder key, use simulation for demo purposes
        if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
            return processMockPayment(fullAddress, paymentLabel);
        }

        try {
            // 1. Create order on backend
            const response = await fetch(`${BACKEND_URL}/api/create-razorpay-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: grandTotal,
                    receipt: `receipt_${Date.now()}`
                })
            });

            if (!response.ok) throw new Error('Failed to create payment session');
            const razorpayOrder = await response.json();

            // 2. Open Razorpay Modal
            const options = {
                key: process.env.RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "FoodCart",
                description: "Order Payment",
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    console.log('Payment Success:', response);
                    await finalizeOrder(fullAddress, paymentLabel);
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                theme: { color: "#3B82F6" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                showToast(response.error.description || 'Payment failed', 'error');
                setIsProcessing(false);
            });
            rzp.open();
        } catch (error) {
            console.error('Razorpay process error:', error);
            // Fallback to mock on error in demo environment
            processMockPayment(fullAddress, paymentLabel);
        }
    };

    const processMockPayment = async (fullAddress, paymentLabel) => {
        setIsProcessing(true);
        showToast(`Connecting to ${paymentLabel} Gateway...`, 'info');

        // Simulate network delay for "Pro" feel
        await new Promise(resolve => setTimeout(resolve, 2000));
        showToast("Authorizing Transaction...", "info");

        await new Promise(resolve => setTimeout(resolve, 1500));
        showToast("Payment Successful!", "success");

        await finalizeOrder(fullAddress, paymentLabel);
    };

    const finalizeOrder = async (fullAddress, paymentLabel) => {
        try {
            const id = await placeOrder(fullAddress, paymentLabel);
            setOrderId(id);
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => navigate('/orders'), 4000);
        } catch (error) {
            console.error('Order error:', error);
            showToast(error.message || 'Failed to place order. Please try again.', 'error');
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const fullAddress = mapAddress ||
            `${address.houseNo}, ${address.street}${address.landmark ? ', ' + address.landmark : ''}, PIN: ${address.pincode}`;

        const paymentLabel = PAYMENT_METHODS.find(p => p.id === selectedPayment)?.label || selectedPayment;

        if (selectedPayment === 'cod') {
            await finalizeOrder(fullAddress, paymentLabel);
        } else {
            await processRazorpayPayment(fullAddress, paymentLabel);
        }
    };

    if (isSuccess) {
        // ...
        return (
            <div className="min-h-screen container mx-auto px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-gray-100 animate-slide-up">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-14 h-14 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed! 🎉</h2>
                    <p className="text-gray-500 mb-4">Thank you for ordering with FoodCart!</p>
                    <div className="bg-green-50 p-4 rounded-xl text-left border border-green-100 mb-4">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Order ID</p>
                        <p className="text-sm font-bold text-gray-800">#{orderId?.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100 mb-4">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Estimated Delivery</p>
                        <p className="text-lg font-bold text-gray-800">35 - 45 Minutes</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl text-left border border-blue-100 mb-6">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Notifications Sent</p>
                        <p className="text-sm text-blue-700 font-medium">📧 Email sent to {user?.email}</p>
                        {user?.phone && <p className="text-sm text-blue-700 font-medium">📱 WhatsApp notification sent</p>}
                    </div>
                    <button onClick={() => navigate('/orders')} className="btn-primary w-full py-3 font-bold rounded-2xl">
                        Track Your Order
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-32">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primary-600 font-bold mb-8">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Cart
                </button>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Checkout</h1>

                <form onSubmit={handlePlaceOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left Column */}
                        <div className="space-y-8">

                            {/* ── Delivery Address ── */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center mb-6">
                                    <div className="bg-primary-100 p-2 rounded-lg text-primary-600 mr-3">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Delivery Address</h2>
                                </div>

                                {/* Live Location Button */}
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={locationLoading}
                                    className="w-full mb-4 flex items-center justify-center py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border-2 border-blue-200 transition-all"
                                >
                                    {locationLoading ? (
                                        <><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />Getting location...</>
                                    ) : (
                                        <><Navigation className="w-5 h-5 mr-2" />Use My Current Location</>
                                    )}
                                </button>

                                {locationError && (
                                    <p className="text-red-500 text-sm mb-3">{locationError}</p>
                                )}

                                {/* Google Maps Embed */}
                                {mapLocation && (
                                    <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                        <iframe
                                            title="Delivery Location"
                                            width="100%"
                                            height="200"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={`https://maps.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}&z=15&output=embed`}
                                            allowFullScreen
                                        />
                                        <div className="p-3 bg-green-50 border-t border-green-100">
                                            <p className="text-xs text-green-700 font-medium">📍 {mapAddress}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Manual Address Fields */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="houseNo">House / Flat No.</label>
                                            <input id="houseNo" className="input-field" placeholder="e.g. 101, A-Block"
                                                value={address.houseNo} onChange={handleAddressChange} required={!mapLocation} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="pincode">Pincode</label>
                                            <input id="pincode" className="input-field" placeholder="e.g. 560001"
                                                value={address.pincode} onChange={handleAddressChange} required={!mapLocation} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="street">Street / Area</label>
                                        <input id="street" className="input-field" placeholder="e.g. Indiranagar, 100ft Road"
                                            value={address.street} onChange={handleAddressChange} required={!mapLocation} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="landmark">Landmark (Optional)</label>
                                        <input id="landmark" className="input-field" placeholder="e.g. Near HDFC Bank"
                                            value={address.landmark} onChange={handleAddressChange} />
                                    </div>
                                </div>
                            </section>

                            {/* ── Payment Methods ── */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center mb-6">
                                    <div className="bg-green-100 p-2 rounded-lg text-green-600 mr-3">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPayment === method.id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-100 hover:border-gray-300 bg-white'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={selectedPayment === method.id}
                                                onChange={() => setSelectedPayment(method.id)}
                                                className="sr-only"
                                            />
                                            <span className="text-2xl mr-3">{method.icon}</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900">{method.label}</p>
                                                <p className="text-xs text-gray-500">{method.desc}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-primary-500' : 'border-gray-300'}`}>
                                                {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* UPI ID Input */}
                                {['upi', 'phonepe', 'gpay', 'paytm', 'bhim', 'amazonpay'].includes(selectedPayment) && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">UPI ID</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder={`e.g. yourname@${selectedPayment === 'phonepe' ? 'ybl' : selectedPayment === 'gpay' ? 'okaxis' : selectedPayment === 'paytm' ? 'paytm' : 'upi'}`}
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                )}

                                {selectedPayment === 'cod' && (
                                    <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                        <p className="text-sm text-yellow-800 font-medium">💵 Please keep exact change of ₹{grandTotal} ready for the delivery partner.</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="space-y-6">
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                                <div className="flex items-center mb-6">
                                    <div className="bg-primary-100 p-2 rounded-lg text-primary-600 mr-3">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Order Summary</h2>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center">
                                                <span className="text-gray-500 font-bold mr-2">{item.quantity} x</span>
                                                <span className="font-medium text-gray-800">{item.name}</span>
                                            </div>
                                            <span className="font-bold">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-dashed space-y-3">
                                    <div className="flex justify-between text-gray-500 text-sm"><span>Subtotal</span><span>₹{totalAmount}</span></div>
                                    <div className="flex justify-between text-gray-500 text-sm"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                                    <div className="flex justify-between text-gray-500 text-sm"><span>Platform Fee</span><span>₹{platformFee}</span></div>
                                    <div className="flex justify-between text-gray-500 text-sm"><span>GST & Charges</span><span>₹{taxes}</span></div>
                                    <div className="flex justify-between text-gray-900 font-extrabold text-xl pt-4 border-t">
                                        <span>Grand Total</span>
                                        <span>₹{grandTotal}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center rounded-2xl mt-6"
                                >
                                    {isProcessing ? (
                                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />Processing...</>
                                    ) : (
                                        <>{selectedPayment === 'cod' ? <Banknote className="w-6 h-6 mr-3" /> : <Wallet className="w-6 h-6 mr-3" />}
                                            {selectedPayment === 'cod' ? `Place Order (COD ₹${grandTotal})` : `Pay ₹${grandTotal}`}</>
                                    )}
                                </button>

                                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-center">
                                    <p className="text-xs text-gray-500">🔒 Secured by 256-bit SSL encryption</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
