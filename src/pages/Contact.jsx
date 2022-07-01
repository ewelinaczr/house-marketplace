import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import styles from "./Contact.module.scss";

export default function Contact() {
	const [message, setMessage] = useState("");
	const [landlord, setLandlord] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const params = useParams();

	useEffect(() => {
		const getLandlord = async () => {
			const docRef = doc(db, "users", params.landlordId);
			const docSnap = await getDoc(docRef);
			// console.log(docSnap.data);
			if (docSnap.exists()) {
				setLandlord(docSnap.data());
			} else {
				toast.error("Could not get owner data");
			}
		};
		getLandlord();
	}, []);

	const onChange = (e) => {
		setMessage(e.target.value);
	};

	return (
		<div className={styles.maingrid}>
			<img
				className={styles.mainimage}
				src='https://images.unsplash.com/photo-1470090606874-79e96ff4d3e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
			></img>
			<div className={styles.pageContainer}>
				<header className={styles.pageHeader}>Contact Owner</header>
				{landlord !== null && (
					<main>
						<div className={styles.contactLandlord}>
							<p className={styles.landlordName}>{landlord?.name}</p>
						</div>
						<form className={styles.messageForm}>
							<div className={styles.messageDiv}>
								<label htmlFor='message' className={styles.messageLabel}>
									Message
								</label>
								<textarea
									name='message'
									id='message'
									className={styles.textArea}
									value={message}
									onChange={onChange}
								></textarea>
							</div>
							<a
								href={`mailto:${landlord.email}?Subject=${searchParams.get(
									"listingName"
								)}&body=${message}`}
							>
								<button type='button' className={styles.primaryButton}>
									Send Message
								</button>
							</a>
						</form>
					</main>
				)}
			</div>
		</div>
	);
}
