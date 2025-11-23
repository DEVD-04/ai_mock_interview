// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFIUyzth9RQEGM5MkaU1OwaAaKsTJ4r2U",
  authDomain: "ai-interview-9cddb.firebaseapp.com",
  projectId: "ai-interview-9cddb",
  storageBucket: "ai-interview-9cddb.firebasestorage.app",
  messagingSenderId: "519265279570",
  appId: "1:519265279570:web:27567eaa479a9bd1f1c98b",
  measurementId: "G-9H71TKB5KD"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db= getFirestore(app);