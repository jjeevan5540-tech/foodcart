import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShoppingCart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setIsSuccess(true);
        } catch (err) {
            setIsLoading(false);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address');
            } else {
                setError('Failed to send reset email. Try again later.');
            }
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full animate-slide-up">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-2 mb-2">
                            <div className="bg-primary-600 p-2 rounded-xl">
                                <ShoppingCart className="text-white w-8 h-8" />
                            </div>
                            <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-rose-500 bg-clip-text text-transparent">
                                FoodCart
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                        <p className="text-gray-500 mb-2">
                            We've sent a password reset link to
                        </p>
                        <p className="text-gray-900 font-semibold mb-6">{email}</p>
                        <p className="text-sm text-gray-400 mb-8">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <Link
                            to="/login"
                            className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-2">
                        <div className="bg-primary-600 p-2 rounded-xl">
                            <ShoppingCart className="text-white w-8 h-8" />
                        </div>
                        <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-rose-500 bg-clip-text text-transparent">
                            FoodCart
                        </span>
                    </div>
                    <p className="text-gray-500 mt-2">Enter your email to reset your password</p>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="input-field pl-10"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <span>Send Reset Link</span>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600 text-sm">
                        <Link to="/login" className="text-primary-600 font-bold hover:underline inline-flex items-center space-x-1">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Login</span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
