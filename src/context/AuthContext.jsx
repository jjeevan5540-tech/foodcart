import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { sendLoginNotification } from '../services/notificationService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const fetchUserData = async () => {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    const userData = userDoc.exists() ? userDoc.data() : {};

                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        name: currentUser.displayName || currentUser.email.split('@')[0],
                        phone: userData.phone || '',
                        address: userData.address || '',
                        savedAddresses: userData.savedAddresses || [],
                        location: userData.location || null,
                    });
                };
                fetchUserData();
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (userData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

            await updateProfile(userCredential.user, { displayName: userData.name });

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                address: '',
                savedAddresses: [],
                location: null,
                createdAt: new Date().toISOString()
            });

            // Send welcome email notification
            sendLoginNotification({ email: userData.email, name: userData.name }).catch(console.warn);

            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: error.message };
        }
    };

    const login = async (identifier, password) => {
        try {
            let email = identifier;

            const isPhone = /^\d{10}$/.test(identifier.replace(/\s/g, ''));

            if (isPhone) {
                const q = query(collection(db, 'users'), where('phone', '==', identifier.replace(/\s/g, '')));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    return { success: false, message: "No account found with this phone number" };
                }

                email = querySnapshot.docs[0].data().email;
            }

            const credential = await signInWithEmailAndPassword(auth, email, password);

            // Send login notification email
            const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            sendLoginNotification({
                email: credential.user.email,
                name: userData.name || credential.user.displayName || credential.user.email.split('@')[0]
            }).catch(console.warn);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            let message = "Invalid email or password";
            if (error.code === 'auth/user-not-found') message = "User not found";
            if (error.code === 'auth/wrong-password') message = "Incorrect password";
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: error.message };
        }
    };

    const updateUserProfile = async (updates) => {
        if (!user) return { success: false, message: 'Not logged in' };
        try {
            await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
            setUser(prev => ({ ...prev, ...updates }));
            return { success: true };
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: error.message };
        }
    };

    const addSavedAddress = async (address) => {
        if (!user) return;
        const newAddresses = [...(user.savedAddresses || []), { id: Date.now(), ...address }];
        await updateUserProfile({ savedAddresses: newAddresses });
    };

    const removeSavedAddress = async (id) => {
        if (!user) return;
        const newAddresses = (user.savedAddresses || []).filter(a => a.id !== id);
        await updateUserProfile({ savedAddresses: newAddresses });
    };

    const updateLocation = async (location) => {
        if (!user) return;
        await updateUserProfile({ location });
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            loading,
            updateUserProfile,
            addSavedAddress,
            removeSavedAddress,
            updateLocation
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
