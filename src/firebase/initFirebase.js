// src/firebase/initFirebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOXltMV3RIrvWm6DgYV_BdnzziMpoD2YI",
  authDomain: "pawmart-4f8f9.firebaseapp.com",
  projectId: "pawmart-4f8f9",
  storageBucket: "pawmart-4f8f9.firebasestorage.app",
  messagingSenderId: "585331579122",
  appId: "1:585331579122:web:efccf9637749bf14dcd86b"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


