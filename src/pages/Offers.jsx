import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Percent, Zap } from 'lucide-react';
import { restaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';

const Offers = () => {
    const navigate = useNavigate();

    const offerRestaurants = restaurants.filter(r => !!r.offer);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                            Restaurant Offers
                            <Ticket className="w-8 h-8 ml-3 text-primary-600 animate-bounce" />
                        </h1>
                        <p className="text-gray-500 mt-1">Best deals and discounts near you</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offerRestaurants.map((restaurant, index) => (
                    <div key={restaurant.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <RestaurantCard restaurant={restaurant} />
                    </div>
                ))}
            </div>

            {offerRestaurants.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <Percent className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">No offers available right now</h3>
                    <p className="text-gray-500 mt-2">Check back later for exciting discounts!</p>
                </div>
            )}

            {/* Promo Banner */}
            <div className="mt-16 bg-gradient-to-r from-primary-600 to-rose-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">Hungry for huge savings?</h2>
                    <p className="text-primary-50 mb-6 text-lg">Use code <span className="bg-white/20 px-3 py-1 rounded font-mono font-bold tracking-wider">FOODKART50</span> for 50% discount on your first order!</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                        Order Now
                    </button>
                </div>
                <Zap className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
            </div>
        </div>
    );
};

export default Offers;
