import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass m-4 rounded-3xl overflow-hidden border-b-0">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-gradient tracking-tight">
                        FoodKart
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-10">
                    <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-semibold transition-all hover:scale-105">Home</Link>
                    <Link to="/offers" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-semibold transition-all hover:scale-105">Offers</Link>
                    <Link to="/orders" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-semibold transition-all hover:scale-105">Orders</Link>
                    <Link to="/help" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-semibold transition-all hover:scale-105">Help</Link>

                    <Link to="/cart" className="relative group p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all">
                        <ShoppingCart className="w-6 h-6 text-slate-700 dark:text-slate-200 group-hover:text-blue-600" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <div className="flex items-center space-x-6 pl-6 border-l border-slate-200 dark:border-slate-800">
                        <Link to="/profile" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-600 font-bold border border-blue-200/50 dark:border-blue-800/50">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-xs text-slate-500 font-medium">Welcome back,</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{user?.name}</p>
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center space-x-4">
                    <Link to="/cart" className="relative p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        <ShoppingCart className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-slate-200/50 dark:border-slate-800/50 py-6 px-6 space-y-4 animate-in fade-in slide-in-from-top duration-300">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 py-3 px-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-200 font-semibold transition-all"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span>Home</span>
                    </Link>
                    <Link
                        to="/offers"
                        className="flex items-center space-x-3 py-3 px-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-200 font-semibold transition-all"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span>Offers</span>
                    </Link>
                    <Link
                        to="/orders"
                        className="flex items-center space-x-3 py-3 px-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-200 font-semibold transition-all"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span>My Orders</span>
                    </Link>
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 py-2 px-4 rounded-xl bg-red-50 text-red-600 font-bold text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
