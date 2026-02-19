import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ShoppingCart, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const { showToast } = useUI();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(identifier, password);
            setIsLoading(false);

            if (result.success) {
                showToast(`Welcome back!`, 'success');
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
        } catch (err) {
            setIsLoading(false);
            setError("An unexpected error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-2">
                        <div className="bg-primary-600 p-2 rounded-xl">
                            <ShoppingCart className="text-white w-8 h-8" />
                        </div>
                        <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-rose-500 bg-clip-text text-transparent">
                            FoodKart
                        </span>
                    </div>
                    <p className="text-gray-500 mt-2">Welcome back! Please login to your account.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center text-red-700 animate-fade-in">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="identifier">
                                Email or Phone Number
                            </label>
                            <div className="relative">
                                {/^\d/.test(identifier) ? (
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                ) : (
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                )}
                                <input
                                    id="identifier"
                                    type="text"
                                    required
                                    className="input-field pl-10"
                                    placeholder="Email or 10-digit mobile"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-600 font-bold hover:underline">
                            Sign up now
                        </Link>
                    </p>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 italic">
                            Hint: Sign up first or use any password if you've already signed up once.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
