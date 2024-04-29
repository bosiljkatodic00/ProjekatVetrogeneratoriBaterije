// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU9-uTJFRRG56iw9h76DgFP46X4l9sXe8",
  authDomain: "reactnode-7f2e3.firebaseapp.com",
  projectId: "reactnode-7f2e3",
  storageBucket: "reactnode-7f2e3.appspot.com",
  messagingSenderId: "769096167424",
  appId: "1:769096167424:web:5e7f4df09f98922f7468e5",
  measurementId: "G-RLQFN3FP25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// gives us an auth instance
const auth = getAuth(app);

// in order to use this auth instance elsewhere
export default auth;
