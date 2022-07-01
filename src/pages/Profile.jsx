import React, { Fragment, useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
	updateDoc,
	doc,
	collection,
	getDoc,
	query,
	where,
	orderBy,
	deleteDoc,
	getDocs,
} from "firebase/firestore";
import { db } from "./../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";
import styles from "./Profile.module.scss";
import YourListing from "../components/YourListing";

function Profile() {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [changeDetails, setChangeDetails] = useState(false);
	const auth = getAuth();
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});
	const { name, email } = formData;

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, "listings");

			const q = query(
				listingsRef,
				where("userRef", "==", auth.currentUser.uid),
				orderBy("timestamp", "desc")
			);

			const querySnap = await getDocs(q);

			let listings = [];

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings(listings);
			setLoading(false);
		};

		fetchUserListings();
	}, [auth.currentUser.uid]);

	const onLogout = () => {
		auth.signOut();
		navigate("/");
	};

	const onSubmit = async (e) => {
		try {
			if (auth.currentUser.displayName !== name) {
				// update name in database
				await updateProfile(auth.currentUser, {
					displayName: name,
				});
				const userRef = doc(db, "users", auth.currentUser.uid);
				await updateDoc(userRef, {
					name: name,
				});
			}
		} catch (error) {
			toast.error("Could not update profile details");
		}
	};

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onDelete = async (listingId) => {
		if (window.confirm("Are you sure you want to delete?")) {
			await deleteDoc(doc(db, "listings", listingId));
			const updatedListings = listings.filter(
				(listing) => listing.id !== listingId
			);
			setListings(updatedListings);
			toast.success("Successfully deleted listing");
		}
	};

	const onEdit = async (listingId) => {
		navigate(`/edit-listing/${listingId}`);
	};

	return (
		<Fragment>
			<div className={styles.maingrid}>
				<img
					className={styles.mainimage}
					src='https://images.unsplash.com/photo-1467226632440-65f0b4957563?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=787&q=80'
				></img>
				<div className={styles.profile}>
					<header className={styles.profileHeader}>
						<p className={styles.pageHeader}>My Profile</p>
						<button type='button' className={styles.logOut} onClick={onLogout}>
							Log Out
						</button>
					</header>
					<main>
						<div className={styles.profileDetailsHeader}>
							<p className={styles.profileDetailsText}>Personal Details</p>
							<p
								className={styles.changePersonalDetails}
								onClick={() => {
									changeDetails && onSubmit();
									setChangeDetails((prevState) => !prevState);
								}}
							>
								{changeDetails ? "done" : "change"}
							</p>
						</div>
						<div className={styles.profileCard}>
							<form>
								<input
									type='text'
									id='name'
									className={
										!changeDetails ? "profileName" : "profileNameActive"
									}
									disabled={!changeDetails ? true : false}
									value={name}
									onChange={onChange}
								/>
								<input
									type='text'
									id='email'
									className={
										!changeDetails ? "profileEmail" : "profileEmailActive"
									}
									disabled={!changeDetails ? true : false}
									value={email}
									onChange={onChange}
								/>
							</form>
						</div>
						<Link to='/create-listing' className={styles.createListing}>
							<img src={homeIcon} alt='home' />
							<p>Sell or rent your apartment</p>
							<img src={arrowRight} alt='arrow' />
						</Link>
						{!loading && listings?.length > 0 && (
							<Fragment>
								<p className={styles.listingText}>Your listings</p>
								<ul className={styles.listingsList}>
									{/* {listings.map((listing) => (
										<ListingItem
											key={listing.id}
											listing={listing.data}
											id={listing.id}
											onDelete={() => onDelete(listing.id)}
											onEdit={() => onEdit(listing.id)}
										/>
									))} */}
									{listings.map((listing) => (
										<YourListing
											key={listing.id}
											listing={listing.data}
											id={listing.id}
											onDelete={() => onDelete(listing.id)}
											onEdit={() => onEdit(listing.id)}
										/>
									))}
								</ul>
							</Fragment>
						)}
					</main>
				</div>
			</div>
		</Fragment>
	);
}

export default Profile;
