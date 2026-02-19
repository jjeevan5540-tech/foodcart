import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA_nQm4RneG98ra81AbKCu-Mb4IAIlPuOo",
    authDomain: "food-kart-3fafc.firebaseapp.com",
    projectId: "food-kart-3fafc",
    storageBucket: "food-kart-3fafc.firebasestorage.app",
    messagingSenderId: "704928910009",
    appId: "1:704928910009:web:2413c2d5d1f1773f9fa968",
    measurementId: "G-GK7W8TV6WP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
