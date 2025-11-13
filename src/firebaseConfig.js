// Import the Firebase functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDOXltMV3RIrvWm6DgYV_BdnzziMpoD2YI",
  authDomain: "pawmart-4f8f9.firebaseapp.com",
  projectId: "pawmart-4f8f9",
  storageBucket: "pawmart-4f8f9.firebasestorage.app",
  messagingSenderId: "585331579122",
  appId: "1:585331579122:web:efccf9637749bf14dcd86b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);        // Firestore
export const auth = getAuth(app);           // Firebase Authentication
export const storage = getStorage(app);     // Storage
