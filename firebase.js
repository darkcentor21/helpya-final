// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATXsRVqI_bdL139GF0zFCwSpIwJHQbm3k",
  authDomain: "helpya-6905c.firebaseapp.com",
  projectId: "helpya-6905c",
  storageBucket: "helpya-6905c.appspot.com",
  messagingSenderId: "928172274636",
  appId: "1:928172274636:web:b93deddab1c69224372369",
  measurementId: "G-PP8BBVEFQH"
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
