// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZDzKnUdr5Fdvhkqg0Nwl-SDDzYbjtFjM",
  authDomain: "helpya-386a4.firebaseapp.com",
  projectId: "helpya-386a4",
  storageBucket: "helpya-386a4.appspot.com",
  messagingSenderId: "60883324779",
  appId: "1:60883324779:web:036b33e2323cc038fb062e"
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
