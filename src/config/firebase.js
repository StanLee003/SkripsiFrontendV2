import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCc81Bx4p4CWkQrLSYKZNZEMHsR3RODByg",
  authDomain: "node-firebase-chat-37719.firebaseapp.com",
  projectId: "node-firebase-chat-37719",
  storageBucket: "node-firebase-chat-37719.appspot.com",
  messagingSenderId: "1010867386114",
  appId: "1:1010867386114:web:d30cd98a1ef81316cf741b",
  measurementId: "G-SGPJQYKKVD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
