import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Set Firebase config in .env file (e.g., FIREBASE_API_KEY=your_key, etc.)
// Then use: const firebaseConfig = { apiKey: process.env.FIREBASE_API_KEY, ... };
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY_PLACEHOLDER",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_FIREBASE_AUTH_DOMAIN_PLACEHOLDER",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "YOUR_FIREBASE_DATABASE_URL_PLACEHOLDER",
    projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_FIREBASE_PROJECT_ID_PLACEHOLDER",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_FIREBASE_STORAGE_BUCKET_PLACEHOLDER",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
    appId: process.env.FIREBASE_APP_ID || "YOUR_FIREBASE_APP_ID_PLACEHOLDER",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "YOUR_FIREBASE_MEASUREMENT_ID_PLACEHOLDER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//console.log(auth);

const database = getDatabase(app);

export { auth, database };
