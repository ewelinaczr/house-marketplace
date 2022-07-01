import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.scss";
import { ReactComponent as ArrowRightIcon } from "./../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "./../assets/svg/visibilityIcon.svg";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

import React from "react";

function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const { email, password, name } = formData;
	const navigate = useNavigate();

	const onChange = (e) => {
		setFormData((prevState) => ({
			// change email or password leaving the other one
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			// REGISTER USER
			const auth = getAuth();
			// create User with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			// get user info
			const user = userCredential.user;
			updateProfile(auth.currentUser, {
				displayName: name,
			});
			// SAVE USER IN DATABASE
			// take user data from inputs
			const formDataCopy = { ...formData };
			// delete password not to put to database
			delete formDataCopy.password;
			formDataCopy.serverTimestamp = serverTimestamp();
			// set users database and and user
			await setDoc(doc(db, "users", user.uid), formDataCopy);

			// after sign up go to home page
			navigate("/");
		} catch (error) {
			toast.error("Something went wrong with registation");
		}
	};

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<img
					className={styles.mainimage}
					src='https://images.unsplash.com/photo-1607427293702-036933bbf746?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80'
				></img>
				<div className={styles.pageContainer}>
					<header>
						<p className={styles.pageHeader}>Hello!</p>
					</header>
					<main>
						<form onSubmit={onSubmit} className={styles.form}>
							<input
								type='text'
								className={styles.nameInput}
								placeholder='Name'
								id='name'
								value={name}
								onChange={onChange}
							/>
							<input
								type='email'
								className={styles.emailInput}
								placeholder='Email'
								id='email'
								value={email}
								onChange={onChange}
							/>
							<div className={styles.passwordInputDiv}>
								<input
									type={showPassword ? "text" : "password"}
									className={styles.passwordInput}
									placeholder='Password'
									id='password'
									value={password}
									onChange={onChange}
								/>
								<img
									src={visibilityIcon}
									alt='show password'
									className={styles.showPassword}
									onClick={() => setShowPassword((prevState) => !prevState)}
								/>
							</div>
							
							<div className={styles.signUpBar}>
								<p className={styles.signUpText}>Sign Up</p>
								<button className={styles.signUpButton}>
									<ArrowRightIcon fill='#fffff' width='34px' height='34px' />
								</button>
							</div>
						</form>
						<OAuth />
						<Link to='/sign-in' className={styles.registerLink}>
							Already have an account? <span>Sign In</span>
						</Link>
					</main>
				</div>
			</div>
		</Fragment>
	);
}

export default SignUp;
