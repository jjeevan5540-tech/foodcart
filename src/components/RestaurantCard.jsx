import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const RestaurantCard = ({ restaurant }) => {
    const { favorites, toggleFavorite } = useCart();
    const isFavorite = favorites.includes(restaurant.id);

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 relative">
            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(restaurant.id);
                }}
                className={`absolute top-4 right-4 z-10 p-3 rounded-2xl transition-all duration-300 ${isFavorite
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                        : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500'
                    }`}
            >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <Link to={`/restaurant/${restaurant.id}`}>
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {restaurant.offer && (
                        <div className="absolute bottom-4 left-4">
                            <span className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-black shadow-lg flex items-center">
                                <span className="mr-2 text-xs opacity-80 uppercase tracking-wider">OFFER</span>
                                {restaurant.offer.label}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">{restaurant.name}</h3>
                        <div className="bg-green-600 text-white px-3 py-1 rounded-xl text-xs font-black flex items-center shadow-lg shadow-green-100 dark:shadow-none">
                            {restaurant.rating} <Star className="w-3 h-3 ml-1 fill-current" />
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-5 line-clamp-1">{restaurant.cuisines.join(', ')}</p>

                    <div className="flex justify-between items-center py-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center text-slate-600 dark:text-slate-400 font-bold text-sm">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            {restaurant.deliveryTime}
                        </div>
                        <div className="text-slate-900 dark:text-white font-black">
                            {restaurant.costForTwo}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default RestaurantCard;
