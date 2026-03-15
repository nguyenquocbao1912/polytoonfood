// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB2yoGnLHhrlJUdyxxhQfgzrrdPK6wjJMQ",
    authDomain: "polytoonfood.firebaseapp.com",
    projectId: "polytoonfood",
    storageBucket: "polytoonfood.firebasestorage.app",
    messagingSenderId: "341066678176",
    appId: "1:341066678176:web:a6af21af7c12f609aa2ec5",
    measurementId: "G-T79791SDMK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);