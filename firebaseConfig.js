// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUqQqmjfDpq88nWs-k0jfiYYaedT7RuaY",
  authDomain: "nextrip-e8ffa.firebaseapp.com",
  projectId: "nextrip-e8ffa",
  storageBucket: "nextrip-e8ffa.firebasestorage.app",
  messagingSenderId: "361293411740",
  appId: "1:361293411740:web:3926fb0468c794ba170459",
  measurementId: "G-8K1MHM3WXP",
  databaseURL: "https://nextrip-e8ffa-default-rtdb.firebaseio.com/",
};

// Esto evita que se inicialice dos veces
const app = getApps().length === 0 
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const auth = getAuth(app);

export { auth };
export const database = getDatabase(app);
export const db = getFirestore(app);