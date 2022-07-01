import React from "react";
import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import styles from "./CreateListing.module.scss";

function CreateLisitng() {
	const [geolocationEnabled, setGeolocationEnabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		area: "",
		floor: "",
		balcony: false,
		garden: false,
		address: "",
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
	});

	const {
		type,
		area,
		balcony,
		garden,
		floor,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address = "warsaw",
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData;

	const auth = getAuth();
	const navigate = useNavigate();
	const isMounted = useRef(true);

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({ ...formData, userRef: user.uid });
				} else {
					navigate("/sign-in");
				}
			});
		}
		return () => {
			isMounted.current = false;
		};
	}, [isMounted, auth, navigate]);

	// Form submit
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (discountedPrice >= regularPrice) {
			setLoading(false);
			toast.error("Discounted price needs to be lower than regular price");
			return;
		}
		if (images.length > 6) {
			toast.error("You can upload maximum 6 photos.");
			return;
		}
		// Geolocation setting
		let geolocation = {};
		let location;

		if (geolocationEnabled) {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
			);
			const data = await response.json();
			console.log(data);

			geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
			geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

			location =
				data.status === "ZERO_RESULTS"
					? undefined
					: data.results[0]?.formatted_address;
			if (location === undefined || location.includes("undefined")) {
				setLoading(false);
				toast.error("Please enter a correct address");
				return;
			}
		} else {
			geolocation.lat = latitude;
			geolocation.lng = longitude;
			// location = address;
		}

		// Store images in firebase
		const storeImage = async (image) => {
			return new Promise((res, rej) => {
				// initialize storage
				const storage = getStorage();
				// create file name
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
				const storageRef = ref(storage, "images/" + fileName);
				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
							default:
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
						rej(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							res(downloadURL);
							console.log("File available at", downloadURL);
						});
					}
				);
			});
		};

		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch(() => {
			setLoading(false);
			toast.error("Images not uploaded");
			return;
		});
		console.log(imgUrls);
		// Object to submit to database
		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp(),
		};
		formDataCopy.location = address;
		// delete info that wa overwritem
		delete formDataCopy.images;
		delete formDataCopy.address;
		// location && (formDataCopy.location = location);
		if (!formDataCopy.offer) {
			delete formDataCopy.discountedPrice;
		}
		const docRef = await addDoc(collection(db, "listings"), formDataCopy);
		setLoading(false);
		toast.success("Listing saved");
		// Navigate to the created listing
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
	};

	// Inputs buttons on mutate
	const onMutate = (e) => {
		let boolean = null;
		if (e.target.value === "true") {
			boolean = true;
		}
		if (e.target.value === "false") {
			boolean = false;
		}
		// Files
		if (e.target.files) {
			setFormData((prevSt) => ({ ...prevSt, images: e.target.files }));
		}
		// Text/Booleans/Numbers
		if (!e.target.files) {
			setFormData((prevSt) => ({
				...prevSt,
				[e.target.id]: boolean ?? e.target.value,
			}));
		}
	};

	// Loading spinner
	if (loading) {
		return <Spinner />;
	}

	return (
		<div className={styles.maingrid}>
			<img
				className={styles.mainimage}
				src='https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1100&q=80'
			></img>
			<div className={styles.profile}>
				<header>
					<p className={styles.pageHeader}>Create a Listing</p>
				</header>

				<main>
					<form onSubmit={onSubmit} className={styles.form}>
						<label className={styles.formLabel}>Sell / Rent</label>
						<div className={styles.formButtons}>
							<button
								type='button'
								className={type === "sale" ? "formButtonActive" : "formButton"}
								id='type'
								value='sale'
								onClick={onMutate}
							>
								Sell
							</button>
							<button
								type='button'
								className={type === "rent" ? "formButtonActive" : "formButton"}
								id='type'
								value='rent'
								onClick={onMutate}
							>
								Rent
							</button>
						</div>

						<label className={styles.formLabel}>Name</label>
						<input
							className={styles.formInputName}
							type='text'
							id='name'
							value={name}
							onChange={onMutate}
							maxLength='50'
							minLength='10'
							required
						/>

						<div className={styles.formFlex}>
							<div>
								<label className={styles.formLabel}>Floor Area</label>
								<input
									className={styles.formInputSmall}
									type='number'
									id='area'
									value={area}
									onChange={onMutate}
									min='1'
									max='300'
									required
								/>
							</div>
							<div>
								<label className={styles.formLabel}>Floor No</label>
								<input
									className={styles.formInputSmall}
									type='number'
									id='floor'
									value={floor}
									onChange={onMutate}
									min='0'
									max='50'
									required
								/>
							</div>
						</div>

						<div className={styles.formFlex}>
							<div>
								<label className={styles.formLabel}>Bedrooms</label>
								<input
									className={styles.formInputSmall}
									type='number'
									id='bedrooms'
									value={bedrooms}
									onChange={onMutate}
									min='1'
									max='50'
									required
								/>
							</div>
							<div>
								<label className={styles.formLabel}>Bathrooms</label>
								<input
									className={styles.formInputSmall}
									type='number'
									id='bathrooms'
									value={bathrooms}
									onChange={onMutate}
									min='1'
									max='50'
									required
								/>
							</div>
						</div>

						<label className={styles.formLabel}>Parking spot</label>
						<div className={styles.formButtons}>
							<button
								className={parking ? "formButtonActive" : "formButton"}
								type='button'
								id='parking'
								value={true}
								onClick={onMutate}
								min='1'
								max='50'
							>
								Yes
							</button>
							<button
								className={
									!parking && parking !== null
										? "formButtonActive"
										: "formButton"
								}
								type='button'
								id='parking'
								value={false}
								onClick={onMutate}
							>
								No
							</button>
						</div>

						<label className={styles.formLabel}>Balcony or Terrace</label>
						<div className={styles.formButtons}>
							<button
								className={balcony ? "formButtonActive" : "formButton"}
								type='button'
								id='balcony'
								value={true}
								onClick={onMutate}
								min='1'
								max='50'
							>
								Yes
							</button>
							<button
								className={
									!balcony && balcony !== null
										? "formButtonActive"
										: "formButton"
								}
								type='button'
								id='balcony'
								value={false}
								onClick={onMutate}
							>
								No
							</button>
						</div>

						<label className={styles.formLabel}>Private garden</label>
						<div className={styles.formButtons}>
							<button
								className={garden ? "formButtonActive" : "formButton"}
								type='button'
								id='garden'
								value={true}
								onClick={onMutate}
								min='1'
								max='50'
							>
								Yes
							</button>
							<button
								className={
									!garden && garden !== null ? "formButtonActive" : "formButton"
								}
								type='button'
								id='garden'
								value={false}
								onClick={onMutate}
							>
								No
							</button>
						</div>

						<label className={styles.formLabel}>Furnished</label>
						<div className={styles.formButtons}>
							<button
								className={furnished ? "formButtonActive" : "formButton"}
								type='button'
								id='furnished'
								value={true}
								onClick={onMutate}
							>
								Yes
							</button>
							<button
								className={
									!furnished && furnished !== null
										? "formButtonActive"
										: "formButton"
								}
								type='button'
								id='furnished'
								value={false}
								onClick={onMutate}
							>
								No
							</button>
						</div>

						<label className={styles.formLabel}>Address</label>
						<textarea
							className={styles.formInputAddress}
							type='text'
							id='address'
							value={address}
							onChange={onMutate}
							required
						/>

						{!geolocationEnabled && (
							<div className={styles.formLatLng}>
								<div>
									<label className={styles.formLabel}>Latitude</label>
									<input
										className={styles.formInputSmall}
										type='number'
										id='latitude'
										value={latitude}
										onChange={onMutate}
										required
									/>
								</div>
								<div>
									<label className={styles.formLabel}>Longitude</label>
									<input
										className={styles.formInputSmall}
										type='number'
										id='longitude'
										value={longitude}
										onChange={onMutate}
										required
									/>
								</div>
							</div>
						)}

						<label className={styles.formLabel}>Offer</label>
						<div className={styles.formButtons}>
							<button
								className={offer ? "formButtonActive" : "formButton"}
								type='button'
								id='offer'
								value={true}
								onClick={onMutate}
							>
								Yes
							</button>
							<button
								className={
									!offer && offer !== null ? "formButtonActive" : "formButton"
								}
								type='button'
								id='offer'
								value={false}
								onClick={onMutate}
							>
								No
							</button>
						</div>

						<label className={styles.formLabel}>Regular Price</label>
						<div className={styles.formPriceDiv}>
							<input
								className={styles.formInputSmall}
								type='number'
								id='regularPrice'
								value={regularPrice}
								onChange={onMutate}
								min='50'
								max='750000000'
								required
							/>
							{type === "rent" && <p className='formPriceText'>$ / Month</p>}
						</div>

						{offer && (
							<>
								<label className={styles.formLabel}>Discounted Price</label>
								<input
									className={styles.formInputSmall}
									type='number'
									id='discountedPrice'
									value={discountedPrice}
									onChange={onMutate}
									min='50'
									max='750000000'
									required={offer}
								/>
							</>
						)}

						<label className={styles.formLabel}>Images</label>
						<p className={styles.imagesInfo}>
							The first image will be the cover (max 6).
						</p>
						<input
							className={styles.formInputFile}
							type='file'
							id='images'
							onChange={onMutate}
							max='6'
							accept='.jpg,.png,.jpeg'
							multiple
							required
						/>
						<button type='submit' className={styles.createListingButton}>
							Create Listing
						</button>
					</form>
				</main>
			</div>
		</div>
	);
}

export default CreateLisitng;
