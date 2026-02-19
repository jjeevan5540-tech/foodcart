import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, MapPin, Search, CheckCircle2, ChefHat, Bike, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

const STATUS_STEPS = [
    { key: 'Pending', label: 'Order Placed', icon: Package, color: 'text-blue-500', bg: 'bg-blue-100' },
    { key: 'Preparing', label: 'Preparing', icon: ChefHat, color: 'text-orange-500', bg: 'bg-orange-100' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, color: 'text-purple-500', bg: 'bg-purple-100' },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
];

const OrderStatusBar = ({ status }) => {
    const currentIdx = STATUS_STEPS.findIndex(s => s.key === status);

    return (
        <div className="mt-4 mb-2">
            <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 z-0">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 to-green-500 transition-all duration-700"
                        style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />
                </div>

                {STATUS_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                        <div key={step.key} className="flex flex-col items-center z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted
                                ? `${step.bg} border-transparent shadow-md ${isCurrent ? 'ring-4 ring-offset-2 ring-blue-200 scale-110' : ''}`
                                : 'bg-white border-gray-200'
                                }`}>
                                <Icon className={`w-5 h-5 ${isCompleted ? step.color : 'text-gray-300'}`} />
                            </div>
                            <p className={`text-[10px] font-bold mt-2 text-center max-w-[60px] leading-tight ${isCompleted ? 'text-gray-700' : 'text-gray-300'}`}>
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Orders = () => {
    const { orders, loadingOrders, addMultipleToCart } = useCart();
    const navigate = useNavigate();
    const { showToast } = useUI();

    const handleReorder = async (order) => {
        try {
            await addMultipleToCart(order.items);
            showToast(`Items from order #${order.id?.slice(-8).toUpperCase()} added to cart!`, 'success');
            navigate('/cart');
        } catch (error) {
            showToast('Failed to reorder. Please try again.', 'error');
        }
    };

    if (loadingOrders) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center mb-8 animate-fade-in">
                    <ShoppingBag className="w-32 h-32 text-gray-300" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">No orders yet</h2>
                <p className="text-gray-500 mb-8 max-w-sm">You haven't placed any orders yet. Time to treat yourself!</p>
                <Link to="/" className="btn-primary flex items-center px-8 py-3">Order Now</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl pb-32">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-500">View and track your recent food adventures</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                        <h2 className="text-3xl font-black text-gray-900">{orders.length}</h2>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Spend</p>
                        <h2 className="text-3xl font-black text-gray-900">₹{orders.reduce((acc, curr) => acc + curr.total, 0)}</h2>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl text-green-600">
                        <span className="text-2xl font-black">₹</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {orders.map((order, index) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Order Header */}
                        <div className="p-6 bg-gray-50 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <ShoppingBag className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-lg text-gray-900">Order #{order.id?.slice(-8).toUpperCase()}</h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {new Date(order.date).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${order.status === 'Delivered'
                                    ? 'bg-green-50 text-green-700 border-green-100'
                                    : order.status === 'Out for Delivery'
                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                        : order.status === 'Preparing'
                                            ? 'bg-orange-50 text-orange-700 border-orange-100'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                    }`}>
                                    {order.status}
                                </span>
                                <span className="text-xl font-black text-gray-900">₹{order.total}</span>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="px-6 pt-4 pb-2">
                            <OrderStatusBar status={order.status} />
                        </div>

                        {/* Order Details */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-4">Ordered Items</p>
                                    <div className="space-y-3">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center">
                                                    <span className="w-6 h-6 bg-gray-100 text-gray-600 rounded flex items-center justify-center text-[10px] font-bold mr-3">
                                                        {item.quantity}
                                                    </span>
                                                    <span className="font-medium text-gray-800">{item.name}</span>
                                                </div>
                                                <span className="text-gray-500 font-medium text-sm">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-3">Delivery Address</p>
                                        <div className="flex items-start text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-primary-500" />
                                            <p className="leading-relaxed">{order.address}</p>
                                        </div>
                                    </div>

                                    {order.paymentMethod && (
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Payment</p>
                                            <p className="text-sm font-bold text-gray-700">💳 {order.paymentMethod}</p>
                                        </div>
                                    )}

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            onClick={() => handleReorder(order)}
                                            className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors"
                                        >
                                            Reorder
                                        </button>
                                        <button
                                            onClick={() => navigate('/help')}
                                            className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            Need Help?
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-8 text-center">
                    <p className="text-gray-400 text-sm flex items-center justify-center">
                        <Search className="w-4 h-4 mr-2" />
                        Looking for something else?
                        <Link to="/" className="text-primary-600 font-bold ml-2 hover:underline">Keep Browsing</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Orders;
