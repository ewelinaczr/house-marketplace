import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "./../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "./../assets/svg/visibilityIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
import React from "react";
import styles from "./SignIn.module.scss";

function SignIn() {
	// show hide password depends on input type
	const [showPassword, setShowPassword] = useState(false);
	// update Data
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;
	const navigate = useNavigate();

	// changing Data State
	const onChange = (e) => {
		e.preventDefault();
		setFormData((prevState) => ({
			// change email or password leaving the other one
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const auth = getAuth();
			const userCredentials = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			// if user exists in db go to home page
			if (userCredentials.user) {
				navigate("/");
			}
		} catch (error) {
			toast.error("Bad User Credentials");
		}
	};

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<img
					className={styles.mainimage}
					src='https://images.unsplash.com/photo-1467226632440-65f0b4957563?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=787&q=80'
				></img>
				<div className={styles.pageContainer}>
					<header>
						<p className={styles.pageHeader}>Welcome Back!</p>
					</header>
					<main>
						<form onSubmit={onSubmit} className={styles.form}>
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
							<Link to='/forgot-password' className={styles.forgotPasswordLink}>
								Forgot Password?
							</Link>
							<div className={styles.signInBar}>
								<p className={styles.signInText}>
									<span>Sign In</span>
								</p>
								<button className={styles.signInButton}>
									<ArrowRightIcon fill='#fffff' width='34px' height='34px' />
								</button>
							</div>
						</form>
						<OAuth />
						<Link to='/sign-up' className={styles.registerLink}>
							Don't have an account? <span> Sign Up</span>
						</Link>
					</main>
				</div>
			</div>
		</Fragment>
	);
}

export default SignIn;
