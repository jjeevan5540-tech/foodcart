import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

const MenuItem = ({ item, restaurantName }) => {
    const { cartItems, addToCart, updateQuantity } = useCart();
    const { showToast } = useUI();

    const cartItem = cartItems.find(i => Number(i.id) === Number(item.id));
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = () => {
        addToCart(item, restaurantName);
        showToast(`${item.name} added to cart!`, 'success');
    };

    return (
        <div className="card-premium group p-6 flex justify-between items-center gap-6 hover:translate-y-[-4px] transition-all">
            <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-3">
                    {item.isVeg ? (
                        <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center rounded-md">
                            <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                        </div>
                    ) : (
                        <div className="w-5 h-5 border-2 border-red-600 flex items-center justify-center rounded-md">
                            <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>
                        </div>
                    )}
                    {item.bestSeller && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">
                            Bestseller
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors tracking-tight">{item.name}</h3>
                <p className="text-blue-600 font-black text-lg mb-3">₹{item.price}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 max-w-md">{item.description}</p>
            </div>

            <div className="relative flex-shrink-0 group/img">
                {item.image ? (
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                        />
                    </div>
                ) : (
                    <div className="w-40 h-40 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed border-slate-200 dark:border-slate-700 italic text-slate-400 text-xs">
                        No Preview
                    </div>
                )}

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32">
                    {quantity > 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl flex items-center justify-between overflow-hidden p-1">
                            <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors rounded-xl"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-black text-slate-900 dark:text-white px-2">{quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 transition-colors rounded-xl"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            className="w-full bg-slate-900 dark:bg-blue-600 text-white shadow-2xl rounded-2xl py-3 font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            Add +
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
