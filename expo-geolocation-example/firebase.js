import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAoYH-R-O_HHAYsni7Rdn5uZvX_Pc6tjnw",
    authDomain: "driverlocation-1029d.firebaseapp.com",
    databaseURL: "https://driverlocation-1029d-default-rtdb.firebaseio.com",
    projectId: "driverlocation-1029d",
    storageBucket: "driverlocation-1029d.appspot.com",
    messagingSenderId: "295502517283",
    appId: "1:295502517283:web:18c3c9abf9f6d29f8fcd96",
    measurementId: "G-EX9YT2EWE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//console.log(auth);

const database = getDatabase(app);

export { auth, database };
