import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UIProvider } from './context/UIContext';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const RestaurantDetails = lazy(() => import('./pages/RestaurantDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Offers = lazy(() => import('./pages/Offers'));
const Profile = lazy(() => import('./pages/Profile'));
const Help = lazy(() => import('./pages/Help'));

const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loading fullScreen />;

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {user && <Navbar />}
                <main className="flex-grow">
                    <Suspense fallback={<Loading />}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

                            {/* Protected Routes */}
                            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
                            <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
                            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    );
};


function App() {
    return (
        <UIProvider>
            <AuthProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </AuthProvider>
        </UIProvider>
    );
}

export default App;
