import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex items-center justify-between group animate-fade-in">
            <div className="flex items-center space-x-4">
                {/* Item Indicator */}
                <div className={`w-3 h-3 border border-gray-300 rounded-sm flex items-center justify-center p-0.5`}>
                    <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="bg-white border rounded-lg flex items-center overflow-hidden shadow-sm">
                    <button
                        onClick={() => updateQuantity(Number(item.id), -1)}
                        className="p-1 px-3 hover:bg-gray-50 transition-colors text-primary-600"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold px-2 min-w-[30px] text-center">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(Number(item.id), 1)}
                        className="p-1 px-3 hover:bg-gray-50 transition-colors text-primary-600"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-20 text-right font-bold text-gray-900">
                    ₹{item.price * item.quantity}
                </div>

                <button
                    onClick={() => removeFromCart(Number(item.id))}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
