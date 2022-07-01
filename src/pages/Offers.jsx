import styles from "./Offers.module.scss";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { db } from "./../firebase.config";
import ListingItem from "../components/ListingItem";

function Offers() {
	// All listings
	const [listings, setListings] = useState(null);
	// Spinner
	const [loading, setLoading] = useState(true);
	// Pagination
	const [lastFetchedListing, setLastFechedListing] = useState(null);

	// useParams - for sale of for rent?
	// looking for category name query search
	const params = useParams();

	// useEffect - fecht and dispaly listings from fb- api call
	useEffect(() => {
		const fetchListings = async () => {
			try {
				// get reference to the collection
				const listingsRef = collection(db, "listings");
				// create a query
				const q = query(
					listingsRef,
					where("offer", "==", true),
					orderBy("timestamp", "desc"),
					limit(10)
				);
				// execute query to get data
				const querySnap = await getDocs(q);
				// Pagination - get last listing on page
				const lastVisible = querySnap.docs[querySnap.docs.length - 1];
				setLastFechedListing(lastVisible);
				// search through query snapshot
				// add data to arr
				let listings = [];
				querySnap.forEach((doc) => {
					// console.log(doc.data());
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				// update states
				setListings(listings);
				// console.log(listings);
				setLoading(false);
			} catch (error) {
				toast.error("Could not fetch listings");
			}
		};
		fetchListings();
	}, []);

	// Pagination / Loaa more
	const onFetchMoreListings = async () => {
		try {
			// get reference to the collection
			const listingsRef = collection(db, "listings");
			// create a query
			const q = query(
				listingsRef,
				where("offer", "==", true),
				orderBy("timestamp", "desc"),
				startAfter(lastFetchedListing),
				limit(10)
			);
			// execute query to get data
			const querySnap = await getDocs(q);
			// Pagination - get last listing on page
			const lastVisible = querySnap.docs[querySnap.docs.length - 1];
			setLastFechedListing(lastVisible);
			// search through query snapshot
			// add data to arr
			let listings = [];
			querySnap.forEach((doc) => {
				// console.log(doc.data());
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			// update states - add / show more listings +10
			setListings((prevState) => [...prevState, ...listings]);
			// console.log(listings);
			setLoading(false);
		} catch (error) {
			toast.error("Could not fetch listings");
		}
	};

	return (
		<div className={styles.category}>
			<header>
				<p className={styles.pageHeader}>Offers</p>
			</header>
			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
					<main>
						<ul className={styles.categoryListings}>
							{listings.map((listing) => (
								<ListingItem
									listing={listing.data}
									id={listing.id}
									key={listing.id}
								/>
							))}
						</ul>
					</main>
					<br />
					<br />
					{lastFetchedListing && (
						<p className={styles.loadMore} onClick={onFetchMoreListings}>
							Load More
						</p>
					)}
				</>
			) : (
				<p>No current offers</p>
			)}
		</div>
	);
}

export default Offers;
