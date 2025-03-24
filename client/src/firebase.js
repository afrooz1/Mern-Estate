// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-estate-f6ab0.firebaseapp.com",
  projectId: "mern-estate-f6ab0",
  storageBucket: "mern-estate-f6ab0.firebasestorage.app",
  messagingSenderId: "698703223811",
  appId: "1:698703223811:web:b3c67ed653f1c538574236"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
