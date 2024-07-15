// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REDIRECT_API_KEY,
  authDomain: "final-project-amit-77a68.firebaseapp.com",
  projectId: "final-project-amit-77a68",
  storageBucket: "final-project-amit-77a68.appspot.com",
  messagingSenderId: "906043598453",
  appId: "1:906043598453:web:149c0f9be031d622c1ba3c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
