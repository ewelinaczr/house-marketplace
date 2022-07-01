// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCfczwwgDjGmWiM-jszs1lnAxwxHxh0PwI",
	authDomain: "house-marketplace-app-3f639.firebaseapp.com",
	projectId: "house-marketplace-app-3f639",
	storageBucket: "house-marketplace-app-3f639.appspot.com",
	messagingSenderId: "19357035541",
	appId: "1:19357035541:web:4c8479588bb87ad575f21c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
