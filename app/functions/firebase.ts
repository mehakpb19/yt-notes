import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAsI4NejShYsGyJkwG_kzMMBVbx0MNzehE",
  authDomain: "notes-gernator.firebaseapp.com",
  projectId: "notes-gernator",
  databaseURL: "https://notes-gernator-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "notes-gernator.firebasestorage.app",
  messagingSenderId: "838350164854",
  appId: "1:838350164854:web:db51162298cd5a2b362057"
};

// Check if Firebase is already initialized; if not, initialize it once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getDatabase(app);

export default db;
