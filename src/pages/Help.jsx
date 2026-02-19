import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone, Mail, AlertTriangle, Send } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { sendIssueReport } from '../services/notificationService';

const CUSTOMER_CARE_PHONE = '8978925540';
const CUSTOMER_CARE_EMAIL = 'jjeevan5540@gmail.com';

const Help = () => {
    const { showToast } = useUI();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('ordering');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [reportForm, setReportForm] = useState({ issue: '', orderId: '', description: '' });
    const [showReport, setShowReport] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const faqs = {
        ordering: [
            { q: "How do I place an order?", a: "Select a restaurant, add items to your cart, and proceed to checkout. Choose your delivery address, pick a payment method (UPI, PhonePe, GPay, Paytm, BHIM, Amazon Pay, or Cash on Delivery), and confirm the order." },
            { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 minutes of placing them. After that, the restaurant status will determine if cancellation is possible. Contact us at 8978925540 for urgent cancellations." },
            { q: "How do I track my order?", a: "Once your order is confirmed, you can track it in real-time from the 'My Orders' section. The status updates automatically: Pending → Preparing → Out for Delivery → Delivered." },
        ],
        payments: [
            { q: "What payment methods are supported?", a: "We support UPI, PhonePe, Google Pay, Paytm, BHIM UPI, Amazon Pay, and Cash on Delivery." },
            { q: "Is my payment secure?", a: "Yes, we use industry-standard 256-bit SSL encryption and secure gateways to process your payments." },
            { q: "How do refunds work?", a: "Refunds for cancelled orders are processed automatically within 5-7 business days to your original payment method." },
        ],
        delivery: [
            { q: "What are the delivery charges?", a: "Standard delivery fee is ₹40. You can see the exact amount at checkout." },
            { q: "Do you offer contactless delivery?", a: "Yes, you can opt for contactless delivery. The delivery partner will leave your order at the door." },
            { q: "What is the estimated delivery time?", a: "Estimated delivery time is 35-45 minutes. You can track your order status in real-time from My Orders." },
        ],
        reports: [
            { q: "How do I report a food quality issue?", a: "Use the 'Report an Issue' section below, or contact us directly at 8978925540 or jjeevan5540@gmail.com. We take food quality very seriously and will resolve your issue promptly." },
            { q: "What if I received the wrong order?", a: "Contact us immediately at 8978925540. We will arrange a replacement or full refund." },
            { q: "How do I report a missing item?", a: "Go to My Orders → Need Help, or call us at 8978925540. We'll resolve it within 24 hours." },
        ],
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await sendIssueReport(reportForm, user);
            if (res.success) {
                showToast('Your report has been submitted! We will contact you within 24 hours.', 'success');
                setReportForm({ issue: '', orderId: '', description: '' });
                setShowReport(false);
            } else {
                showToast(res.error || 'Failed to submit report. Please try calling us.', 'error');
            }
        } catch (error) {
            showToast('Something went wrong. Please try again later.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl pb-32">
            <div className="text-center mb-16">
                <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-600 shadow-lg shadow-primary-100">
                    <HelpCircle className="w-10 h-10" />
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Help & Support</h1>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">Have a question or issue? We're here 24/7 to help you.</p>
            </div>

            {/* Emergency Contact Banner */}
            <div className="bg-gradient-to-r from-primary-600 to-rose-500 rounded-3xl p-6 mb-10 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-black text-lg">🆘 Need Immediate Help?</p>
                        <p className="text-white/80 text-sm">Our customer care team is available 24/7</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={`tel:${CUSTOMER_CARE_PHONE}`}
                            className="flex items-center bg-white text-primary-600 font-black px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all"
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            {CUSTOMER_CARE_PHONE}
                        </a>
                        <a
                            href={`mailto:${CUSTOMER_CARE_EMAIL}`}
                            className="flex items-center bg-white/20 text-white font-black px-6 py-3 rounded-2xl hover:bg-white/30 transition-all border border-white/30"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Email Us
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1 space-y-3">
                    {[
                        { key: 'ordering', label: '🛒 Ordering' },
                        { key: 'payments', label: '💳 Payments' },
                        { key: 'delivery', label: '🚴 Delivery' },
                        { key: 'reports', label: '⚠️ Reports' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setExpandedFaq(null); }}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.key
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20'
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* FAQ Content */}
                <div className="md:col-span-3 space-y-4">
                    {faqs[activeTab].map((faq, index) => (
                        <div key={index} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                className="w-full text-left px-8 py-6 flex items-center justify-between"
                            >
                                <span className="font-bold text-gray-800 text-lg">{faq.q}</span>
                                {expandedFaq === index ? <ChevronUp className="text-gray-400 flex-shrink-0" /> : <ChevronDown className="text-gray-400 flex-shrink-0" />}
                            </button>
                            {expandedFaq === index && (
                                <div className="px-8 pb-8 text-gray-500 leading-relaxed font-medium">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Report Food Issue Section */}
            <div className="mt-16">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                        onClick={() => setShowReport(!showReport)}
                        className="w-full flex items-center justify-between p-8 text-left"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mr-4 text-red-500">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 text-lg">Report a Food Issue</h3>
                                <p className="text-sm text-gray-500">Report food quality, wrong items, or any other issue</p>
                            </div>
                        </div>
                        {showReport ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                    </button>

                    {showReport && (
                        <form onSubmit={handleReportSubmit} className="px-8 pb-8 space-y-4 animate-fade-in border-t border-gray-50">
                            <div className="pt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issue Type</label>
                                <select
                                    className="input-field"
                                    value={reportForm.issue}
                                    onChange={e => setReportForm(prev => ({ ...prev, issue: e.target.value }))}
                                    required
                                >
                                    <option value="">Select an issue</option>
                                    <option>Food quality issue</option>
                                    <option>Wrong items delivered</option>
                                    <option>Missing items</option>
                                    <option>Late delivery</option>
                                    <option>Delivery partner issue</option>
                                    <option>Payment issue</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order ID (Optional)</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. ABC12345"
                                    value={reportForm.orderId}
                                    onChange={e => setReportForm(prev => ({ ...prev, orderId: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    className="input-field h-28 resize-none"
                                    placeholder="Please describe your issue in detail..."
                                    value={reportForm.description}
                                    onChange={e => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn-primary w-full py-3 flex items-center justify-center font-bold rounded-2xl ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={submitting}
                            >
                                <Send className="w-5 h-5 mr-2" />
                                {submitting ? 'Submitting...' : 'Submit Report'}
                            </button>
                            <p className="text-xs text-gray-400 text-center">
                                Or contact us directly: <a href={`tel:${CUSTOMER_CARE_PHONE}`} className="text-primary-600 font-bold">{CUSTOMER_CARE_PHONE}</a> | <a href={`mailto:${CUSTOMER_CARE_EMAIL}`} className="text-primary-600 font-bold">{CUSTOMER_CARE_EMAIL}</a>
                            </p>
                        </form>
                    )}
                </div>
            </div>

            {/* Contact Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <a href={`tel:${CUSTOMER_CARE_PHONE}`} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 text-center shadow-sm hover:shadow-lg hover:border-primary-200 transition-all group">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:scale-110 transition-transform">
                        <Phone className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2">Call Us</h3>
                    <p className="text-sm text-gray-500 mb-4">Available 24/7 for urgent issues</p>
                    <p className="text-primary-600 font-black">{CUSTOMER_CARE_PHONE}</p>
                </a>

                <a href={`mailto:${CUSTOMER_CARE_EMAIL}`} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 text-center shadow-sm hover:shadow-lg hover:border-primary-200 transition-all group">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                        <Mail className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2">Email Us</h3>
                    <p className="text-sm text-gray-500 mb-4">Reply within 2-4 business hours</p>
                    <p className="text-primary-600 font-black text-sm">{CUSTOMER_CARE_EMAIL}</p>
                </a>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 text-center shadow-sm hover:shadow-lg transition-all group">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-sm text-gray-500 mb-4">Chat with us on WhatsApp</p>
                    <a
                        href={`https://wa.me/91${CUSTOMER_CARE_PHONE}?text=Hi, I need help with my FoodKart order`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 font-black"
                    >
                        {CUSTOMER_CARE_PHONE}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Help;
