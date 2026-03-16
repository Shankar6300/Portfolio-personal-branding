import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE2rhIzp0sQA5bCuF1UZCQdFnHOpFClhg",
  authDomain: "directfarmapp-c8d78.firebaseapp.com",
  projectId: "directfarmapp-c8d78",
  storageBucket: "directfarmapp-c8d78.firebasestorage.app",
  messagingSenderId: "223172212993",
  appId: "1:223172212993:web:a9980e474d04ddb0658300"
};

let app;
let auth;
let db;
let storage;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    console.error("Firebase initialization error", error);
}

export { auth, db, storage };
