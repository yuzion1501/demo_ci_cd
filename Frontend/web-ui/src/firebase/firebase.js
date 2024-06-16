// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDfeDep6iCA7GyLLdfj34epJB9jRGsIISw",
    authDomain: "fit-viec.firebaseapp.com",
    projectId: "fit-viec",
    storageBucket: "fit-viec.appspot.com",
    messagingSenderId: "396433078827",
    appId: "1:396433078827:web:50be5aa49e9e8d0e5d086e",
    measurementId: "G-9KN4X6VCVL",
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
