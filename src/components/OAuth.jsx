import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "./../assets/svg/googleIcon.svg";
import styles from "./OAuth.module.scss";

function OAuth() {
	const navigate = useNavigate();
	const location = useLocation();

	const onGoogleClick = async () => {
		try {
			const auth = getAuth();
			// select google as popup provider
			const provider = new GoogleAuthProvider();
			// set popup
			const result = await signInWithPopup(auth, provider);
			// get user
			const user = result.user;
			// check if user exist in db - sign in or sign up
			// reference to database / collection
			// pass user uid to check if it exist in db
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);
			// if user doesnt exists => create user in database
			if (!docSnap.exists()) {
				// create user in users collection with id name email
				await setDoc(doc(db, "users", user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}
			// if signed in redirect to home page
			navigate("/");
		} catch (error) {
			toast.error("Could not autorize with Google");
		}
	};

	return (
		<div className={styles.socialLogin}>
			<p>Sign {location.pathname === "/sign-up" ? "Up" : "In"} with Google Account</p>
			<button className={styles.socialIconDiv} onClick={onGoogleClick}>
				<img className={styles.socialIconImg} src={googleIcon} alt='google logo' />
			</button>
		</div>
	);
}

export default OAuth;
