// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnQSsJNTATeYIE28H0tU0lsi1oPLrcA5U",
  authDomain: "flickverse-masala.firebaseapp.com",
  projectId: "flickverse-masala",
  storageBucket: "flickverse-masala.firebasestorage.app",
  messagingSenderId: "555343226529",
  appId: "1:555343226529:web:d21647126e9c8dd5a972e0",
  measurementId: "G-TWLFHTK1XY"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
