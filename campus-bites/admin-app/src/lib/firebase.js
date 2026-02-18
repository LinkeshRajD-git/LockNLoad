// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1924rK7cBcUjM28GUlvMH8reY-9s1Gfw",
  authDomain: "locknload-532f9.firebaseapp.com",
  projectId: "locknload-532f9",
  storageBucket: "locknload-532f9.firebasestorage.app",
  messagingSenderId: "99550771954",
  appId: "1:99550771954:web:475d8943e0510cee256e6b",
  measurementId: "G-88B25845WC"
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Only initialize analytics on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics };