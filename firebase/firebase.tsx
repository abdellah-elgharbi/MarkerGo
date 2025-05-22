// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDEWr6TjsWN1l-rN4Yuobuh35V-rnpCQ24",
  authDomain: "commerce-app-6aa9d.firebaseapp.com",
  databaseURL: "https://commerce-app-6aa9d-default-rtdb.firebaseio.com",
  projectId: "commerce-app-6aa9d",
  storageBucket: "commerce-app-6aa9d.firebasestorage.app",
  messagingSenderId: "43006236765",
  appId: "1:43006236765:web:3be3a96b22164100fb95b4",
  measurementId: "G-0RBYWG4B6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };