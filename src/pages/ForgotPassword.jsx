import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "./../assets/svg/keyboardArrowRightIcon.svg";
import styles from "./ForgotPassword.module.scss";

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const onChange = (e) => setEmail(e.target.value);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const auth = getAuth();
			await sendPasswordResetEmail(auth, email);
			toast.success("Email was sent.");
		} catch (error) {
			toast.error("Could not send reset email.");
		}
	};

	return (
		<div className={styles.pageContainer}>
			<header>
				<p className={styles.pageHeader}>Gorgot Password</p>
			</header>
			<main>
				<form onSubmit={onSubmit}>
					<input
						type='email'
						className='emailInput'
						placeholder='Email'
						id='email'
						value={email}
						onChange={onChange}
					/>
					<Link className={styles.forgotPasswordLink} to='/sign-in'>
						Sign In
					</Link>
					<div className={styles.signInBar}>
						<div className={styles.signInText}>Send reset link</div>
						<button className={styles.signInButton}>
							<ArrowRightIcon fill='#ffffff' width='34ps' height='34px' />
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}

export default ForgotPassword;
