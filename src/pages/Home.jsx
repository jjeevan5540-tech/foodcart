import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Clock, ChevronRight, Heart } from 'lucide-react';
import { restaurants, cuisines } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [sortBy, setSortBy] = useState('rating'); // rating, time, costLow, costHigh
    const [showOffersOnly, setShowOffersOnly] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const navigate = useNavigate();
    const resultsRef = useRef(null);
    const { favorites } = useCart();

    const filteredRestaurants = useMemo(() => {
        let result = restaurants.filter(restaurant => {
            const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.cuisines.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisines.includes(selectedCuisine);
            const matchesOffer = !showOffersOnly || !!restaurant.offer;
            const matchesFavorite = !showFavoritesOnly || favorites.includes(restaurant.id);
            return matchesSearch && matchesCuisine && matchesOffer && matchesFavorite;
        });

        // Sorting logic
        return result.sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'time') {
                const timeA = parseInt(a.deliveryTime);
                const timeB = parseInt(b.deliveryTime);
                return timeA - timeB;
            }
            if (sortBy === 'costLow') {
                const costA = parseInt(a.costForTwo.replace('₹', ''));
                const costB = parseInt(b.costForTwo.replace('₹', ''));
                return costA - costB;
            }
            if (sortBy === 'costHigh') {
                const costA = parseInt(a.costForTwo.replace('₹', ''));
                const costB = parseInt(b.costForTwo.replace('₹', ''));
                return costB - costA;
            }
            return 0;
        });
    }, [searchQuery, selectedCuisine, sortBy, showOffersOnly, showFavoritesOnly, favorites]);

    const isFiltering = searchQuery.length > 0 || selectedCuisine !== 'All' || showOffersOnly || showFavoritesOnly;

    const scrollToResults = () => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleCuisineSelect = (cuisine) => {
        setSelectedCuisine(cuisine);
        if (cuisine !== 'All') {
            scrollToResults();
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCuisine('All');
        setShowOffersOnly(false);
        setShowFavoritesOnly(false);
        setSortBy('rating');
    };

    return (
        <div className="pb-20 space-y-12">
            {/* Hero Section */}
            <section className="relative px-4 pt-10">
                <div className="container mx-auto relative h-[400px] rounded-[3rem] overflow-hidden group shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600"
                        alt="Hero"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col items-center justify-center text-center px-6">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                            The food you love, <br /><span className="text-blue-500">delivered fast.</span>
                        </h1>

                        <div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                            <input
                                type="text"
                                placeholder="Search restaurants, cuisines, dishes..."
                                className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white text-slate-900 text-lg outline-none focus:ring-4 focus:ring-blue-500/30 shadow-2xl transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {/* Search Suggestions */}
                            {searchQuery.length > 1 && (
                                <div className="absolute top-full left-0 w-full mt-4 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="p-4 max-h-[400px] overflow-y-auto no-scrollbar">
                                        {restaurants
                                            .filter(r =>
                                                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                r.cuisines.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                                            )
                                            .slice(0, 5)
                                            .map((r) => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => navigate(`/restaurant/${r.id}`)}
                                                    className="w-full flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl transition-colors text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl overflow-hidden mr-4">
                                                        <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{r.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{r.cuisines.join(', ')}</p>
                                                    </div>
                                                </button>
                                            ))
                                        }
                                        {cuisines
                                            .filter(c => c !== 'All' && c.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => { setSearchQuery(''); setSelectedCuisine(c); }}
                                                    className="w-full flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl transition-colors text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-4 text-blue-600">
                                                        <Search className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Search for "{c}" cuisine</p>
                                                        <p className="text-xs text-slate-500 font-medium">Browse best {c} restaurants</p>
                                                    </div>
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Cuisine Filter */}
            <section className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div className="space-y-2">
                        <p className="text-blue-600 font-black text-sm uppercase tracking-widest">Inspiration</p>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white">Explore by Cuisines</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center transition-all border shadow-sm ${showFavoritesOnly ? 'bg-rose-500 border-rose-500 text-white ring-4 ring-rose-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-rose-500'}`}
                        >
                            <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                            Favorites
                        </button>

                        <button
                            onClick={() => {
                                setShowOffersOnly(!showOffersOnly);
                                if (!showOffersOnly) scrollToResults();
                            }}
                            className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center transition-all border shadow-sm ${showOffersOnly ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500'}`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Special Offers
                        </button>

                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none pl-6 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm cursor-pointer min-w-[180px]"
                            >
                                <option value="rating">Top Rated</option>
                                <option value="time">Fastest Delivery</option>
                                <option value="costLow">Price: Low to High</option>
                                <option value="costHigh">Price: High to Low</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-5 overflow-x-auto pb-6 no-scrollbar">
                    {cuisines.map(cuisine => (
                        <button
                            key={cuisine}
                            onClick={() => handleCuisineSelect(cuisine)}
                            className={`px-8 py-3 rounded-[1.5rem] whitespace-nowrap font-bold transition-all duration-300 ${selectedCuisine === cuisine
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            {cuisine}
                        </button>
                    ))}
                </div>
            </section>

            {/* New on FoodCart */}
            {!isFiltering && (
                <section className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">New on FoodCart</h2>
                        <button onClick={resetFilters} className="text-blue-600 font-bold text-sm">See All</button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
                        {restaurants.filter(r => r.id > 10).map((restaurant) => (
                            <div key={restaurant.id} className="min-w-[320px] snap-center">
                                <RestaurantCard restaurant={restaurant} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Trending Now */}
            {!isFiltering && (
                <section className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                            Trending Now <span className="ml-2 text-2xl">🔥</span>
                        </h2>
                        <button onClick={resetFilters} className="text-blue-600 font-bold text-sm">See All</button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
                        {restaurants.filter(r => r.rating >= 4.6).map((restaurant) => (
                            <div key={restaurant.id} className="min-w-[320px] snap-center">
                                <RestaurantCard restaurant={restaurant} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Restaurant List */}
            <section ref={resultsRef} className="container mx-auto px-6">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                            {selectedCuisine === 'All' ? 'Best Around You' : `${selectedCuisine} Gems`}
                        </h2>
                        <div className="h-1.5 w-20 bg-blue-600 rounded-full mt-3"></div>
                    </div>
                    <span className="text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full text-sm">
                        {filteredRestaurants.length} active places
                    </span>
                </div>

                {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredRestaurants.map((restaurant, index) => (
                            <div key={restaurant.id} className="animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                                <RestaurantCard restaurant={restaurant} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-100/50 dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">No matches found</h3>
                        <p className="text-slate-500 mt-3 font-medium text-lg">We couldn't find any restaurants matching your preferences.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCuisine('All'); }}
                            className="mt-8 btn-premium"
                        >
                            Discover All Restaurants
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
