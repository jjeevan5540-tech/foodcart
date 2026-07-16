import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Clock, ShoppingBag, Info, Ticket, Search } from 'lucide-react';
import { restaurants } from '../data/restaurants';
import { useCart } from '../context/CartContext';
import MenuItem from '../components/MenuItem';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cartItems, totalItems, totalAmount } = useCart();

    const [menuSearch, setMenuSearch] = useState('');
    const [isVegOnly, setIsVegOnly] = useState(false);

    const restaurant = useMemo(() => {
        return restaurants.find(r => r.id === parseInt(id));
    }, [id]);

    const filteredMenu = useMemo(() => {
        if (!restaurant) return [];
        return restaurant.menu.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
            const matchesVeg = !isVegOnly || item.isVeg;
            return matchesSearch && matchesVeg;
        }).map((item, index) => ({
            ...item,
            bestSeller: index < 2 // First 2 items are bestsellers
        }));
    }, [restaurant, menuSearch, isVegOnly]);

    if (!restaurant) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold">Restaurant not found</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-primary-600 font-bold">
                    Go back to Home
                </button>
            </div>
        );
    }

    const restaurantCartItems = cartItems.filter(item => item.restaurantName === restaurant.name);

    return (
        <div className="pb-32 bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Header Image & Info */}
            <div className="relative h-[450px] overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover animate-in zoom-in duration-[10s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

                <div className="absolute top-8 left-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl hover:bg-white/20 transition-all group"
                    >
                        <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-3">
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-xl flex items-center font-black text-sm shadow-lg shadow-green-500/20">
                                        <Star className="w-4 h-4 fill-current mr-1.5" />
                                        {restaurant.rating}
                                    </span>
                                    {restaurant.offer && (
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-xl flex items-center font-black text-[11px] uppercase tracking-wider shadow-lg shadow-blue-600/20">
                                            <Ticket className="w-4 h-4 mr-1.5" />
                                            {restaurant.offer.label}
                                        </span>
                                    )}
                                    <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-xl flex items-center font-bold text-sm border border-white/10">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        {restaurant.deliveryTime}
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                                    {restaurant.name}
                                </h1>
                                <p className="text-xl text-slate-200 font-medium max-w-2xl">
                                    {restaurant.cuisines.join(' • ')} • {restaurant.costForTwo}
                                </p>
                            </div>

                            {restaurant.offer && (
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col items-center justify-center min-w-[150px] group hover:scale-105 transition-transform duration-300">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Use Promo</span>
                                    <span className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{restaurant.offer.code}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="container mx-auto px-6 mt-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Full Menu</h2>
                        <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-3"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setIsVegOnly(!isVegOnly)}
                            className={`px-5 py-3 rounded-2xl font-bold border transition-all flex items-center justify-center gap-2 ${isVegOnly ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-500/20' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${isVegOnly ? 'border-green-600' : 'border-slate-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${isVegOnly ? 'bg-green-600' : 'bg-transparent'}`}></div>
                            </div>
                            Veg Only
                        </button>

                        <div className="relative flex-grow sm:flex-grow-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for dishes..."
                                value={menuSearch}
                                onChange={(e) => setMenuSearch(e.target.value)}
                                className="w-full sm:w-64 pl-12 pr-6 py-3 rounded-2xl border border-slate-200 bg-white font-bold text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {filteredMenu.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredMenu.map((item, index) => (
                            <div key={item.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 50}ms` }}>
                                <MenuItem item={item} restaurantName={restaurant.name} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-400 font-bold text-lg">No dishes found matching your search.</p>
                        <button
                            onClick={() => { setMenuSearch(''); setIsVegOnly(false); }}
                            className="mt-4 text-blue-600 font-bold hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Cart Summary Bar (Sticky Bottom) */}
            {totalItems > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] md:w-auto z-40">
                    <button
                        onClick={() => navigate('/cart')}
                        className="bg-slate-950 dark:bg-blue-600 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center justify-between gap-12 group hover:scale-105 transition-all duration-300 w-full"
                    >
                        <div className="flex items-center gap-6">
                            <div className="bg-white/20 px-4 py-1.5 rounded-2xl text-xs font-black tracking-widest uppercase">
                                {totalItems} {totalItems === 1 ? 'Chef special' : 'Chef specials'}
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-1">Subtotal</p>
                                <p className="text-2xl font-black tracking-tight">₹{totalAmount}</p>
                            </div>
                        </div>
                        <div className="flex items-center font-black uppercase tracking-[0.2em] text-sm gap-3">
                            <span>Checkout</span>
                            <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default RestaurantDetails;
