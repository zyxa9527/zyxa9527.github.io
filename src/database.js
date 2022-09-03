import firebase from 'firebase/app';
import 'firebase/database';
// Import the functions you need from the SDKs you need 
const firebaseConfig = {
  apiKey: "AIzaSyAd-yBqGvCyF---iF5bG5GDYaY8gVUe6xg",
  authDomain: "moster-link.firebaseapp.com",
  databaseURL: "https://moster-link-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "moster-link",
  storageBucket: "moster-link.appspot.com",
  messagingSenderId: "480729166195",
  appId: "1:480729166195:web:3e9ceb89dd629e0ca2d506",
  measurementId: "G-GESHSQCCP8"
};

 
export const db = firebase
  .initializeApp(firebaseConfig)
  .database();