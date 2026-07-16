import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, CreditCard, Shield, ChevronRight, Plus, Trash2, Navigation, Edit3, Check, X } from 'lucide-react';
import { useUI } from '../context/UIContext';

const Profile = () => {
    const { user, updateUserProfile, addSavedAddress, removeSavedAddress, updateLocation } = useAuth();
    const { showToast } = useUI();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editPhone, setEditPhone] = useState(user?.phone || '');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: 'Home', line1: '', city: '', pincode: '' });
    const [mapLocation, setMapLocation] = useState(user?.location || null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [mapAddress, setMapAddress] = useState('');

    useEffect(() => {
        if (user?.location) setMapLocation(user.location);
    }, [user]);

    const handleSaveProfile = async () => {
        const result = await updateUserProfile({ name: editName, phone: editPhone });
        if (result.success) {
            showToast('Profile updated!', 'success');
            setIsEditing(false);
        } else {
            showToast(result.message || 'Failed to update profile', 'error');
        }
    };

    const handleGetLocation = () => {
        setLocationLoading(true);
        if (!navigator.geolocation) { setLocationLoading(false); return; }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const loc = { lat: latitude, lng: longitude };
                setMapLocation(loc);
                setLocationLoading(false);
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    setMapAddress(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } catch {
                    setMapAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }
                await updateLocation(loc);
                showToast('Location updated!', 'success');
            },
            () => { setLocationLoading(false); showToast('Could not get location', 'error'); }
        );
    };

    const handleAddAddress = async () => {
        if (!newAddress.line1 || !newAddress.city) {
            showToast('Please fill in address details', 'error');
            return;
        }
        await addSavedAddress(newAddress);
        setNewAddress({ label: 'Home', line1: '', city: '', pincode: '' });
        setShowAddAddress(false);
        showToast('Address saved!', 'success');
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl pb-32">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-10">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary-600 to-rose-500 opacity-10" />
                        <div className="relative">
                            <div className="w-24 h-24 bg-primary-100 rounded-3xl mx-auto flex items-center justify-center text-3xl font-black text-primary-600 border-4 border-white shadow-xl mb-4">
                                {user?.name?.[0]?.toUpperCase() || '?'}
                            </div>

                            {isEditing ? (
                                <div className="space-y-3 mb-4">
                                    <input
                                        className="input-field text-center font-bold"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                    <input
                                        className="input-field text-center"
                                        value={editPhone}
                                        onChange={e => setEditPhone(e.target.value)}
                                        placeholder="Phone number"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveProfile} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center">
                                            <Check className="w-4 h-4 mr-1" />Save
                                        </button>
                                        <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl font-bold text-sm flex items-center justify-center">
                                            <X className="w-4 h-4 mr-1" />Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
                                    <p className="text-gray-500 font-medium mb-4">{user?.email}</p>
                                    {user?.phone && <p className="text-gray-400 text-sm mb-4">📞 {user.phone}</p>}
                                    <button onClick={() => setIsEditing(true)} className="w-full btn-primary py-3 text-sm flex items-center justify-center">
                                        <Edit3 className="w-4 h-4 mr-2" />Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Settings */}
                    <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                            <Shield className="w-6 h-6 mr-3 text-primary-600" />Account Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-4 border-b border-gray-50">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gray-50 rounded-2xl mr-4 text-gray-400"><Mail className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="font-bold text-gray-800">{user?.email}</p>
                                    </div>
                                </div>
                                <span className="text-green-600 text-xs font-black bg-green-50 px-3 py-1 rounded-full uppercase">Verified</span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-gray-50">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gray-50 rounded-2xl mr-4 text-gray-400"><Phone className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                        <p className="font-bold text-gray-800">{user?.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditing(true)} className="text-primary-600 text-sm font-black hover:underline">Update</button>
                            </div>
                        </div>
                    </section>

                    {/* Live Location & Map */}
                    <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                            <Navigation className="w-6 h-6 mr-3 text-blue-600" />My Location
                        </h3>
                        <button
                            onClick={handleGetLocation}
                            disabled={locationLoading}
                            className="w-full mb-4 flex items-center justify-center py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border-2 border-blue-200 transition-all"
                        >
                            {locationLoading ? (
                                <><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />Getting location...</>
                            ) : (
                                <><Navigation className="w-5 h-5 mr-2" />Update My Location</>
                            )}
                        </button>

                        {mapLocation && (
                            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                <iframe
                                    title="My Location"
                                    width="100%"
                                    height="220"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://maps.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}&z=14&output=embed`}
                                    allowFullScreen
                                />
                                {mapAddress && (
                                    <div className="p-3 bg-blue-50 border-t border-blue-100">
                                        <p className="text-xs text-blue-700 font-medium">📍 {mapAddress}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!mapLocation && (
                            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                <iframe
                                    title="Default Map"
                                    width="100%"
                                    height="220"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src="https://maps.google.com/maps?q=Hyderabad,India&z=12&output=embed"
                                    allowFullScreen
                                />
                                <div className="p-3 bg-gray-50 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">Click "Update My Location" to show your current position and nearby restaurants</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Address Book */}
                    <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-gray-900 flex items-center">
                                <MapPin className="w-6 h-6 mr-3 text-rose-500" />Address Book
                            </h3>
                            <button
                                onClick={() => setShowAddAddress(!showAddAddress)}
                                className="flex items-center text-sm font-bold text-primary-600 hover:underline"
                            >
                                <Plus className="w-4 h-4 mr-1" />Add New
                            </button>
                        </div>

                        {/* Add Address Form */}
                        {showAddAddress && (
                            <div className="mb-6 p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 animate-fade-in">
                                <div className="flex gap-2">
                                    {['Home', 'Work', 'Other'].map(label => (
                                        <button
                                            key={label}
                                            onClick={() => setNewAddress(prev => ({ ...prev, label }))}
                                            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newAddress.label === label ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <input className="input-field" placeholder="Address Line 1" value={newAddress.line1} onChange={e => setNewAddress(prev => ({ ...prev, line1: e.target.value }))} />
                                <div className="grid grid-cols-2 gap-3">
                                    <input className="input-field" placeholder="City" value={newAddress.city} onChange={e => setNewAddress(prev => ({ ...prev, city: e.target.value }))} />
                                    <input className="input-field" placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleAddAddress} className="flex-1 bg-primary-600 text-white py-2 rounded-xl font-bold text-sm">Save Address</button>
                                    <button onClick={() => setShowAddAddress(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl font-bold text-sm">Cancel</button>
                                </div>
                            </div>
                        )}

                        {/* Saved Addresses */}
                        {(user?.savedAddresses || []).length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">No saved addresses yet. Add one above!</p>
                        ) : (
                            <div className="space-y-3">
                                {(user?.savedAddresses || []).map((addr) => (
                                    <div key={addr.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-start">
                                            <span className="text-lg mr-3">{addr.label === 'Home' ? '🏠' : addr.label === 'Work' ? '🏢' : '📍'}</span>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{addr.label}</p>
                                                <p className="text-gray-500 text-xs">{addr.line1}, {addr.city} {addr.pincode}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeSavedAddress(addr.id)} className="text-red-400 hover:text-red-600 ml-4">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
