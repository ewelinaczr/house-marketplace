import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { FactorId, getAuth } from "firebase/auth";
import styles from "./Listing.module.scss";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
// react-icons
import { BsHouse } from "react-icons/bs";
import { IoBedOutline } from "react-icons/io5";
import { BiBath } from "react-icons/bi";
import { TbParking } from "react-icons/tb";
import { MdOutlineChair } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import { MdBalcony } from "react-icons/md";
import { GiHighGrass } from "react-icons/gi";
// leaflet
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// swiper
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

function Listing() {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);
	const [size, setSize] = useState(3);
	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth();

	useEffect(() => {
		if (window.innerWidth < 800) {
			setSize(1);
		} else if (window.innerWidth > 800) {
			setSize(3);
		}
	}, []);

	// To set single Listing by params/id
	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		};

		fetchListing();
	}, [params.listingId, navigate]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<main>
			{/* Slideshow */}
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y]}
				slidesPerView={size}
				pagination={{ clickable: true }}
				spaceBetween={5}
				navigation
				style={{ height: "300px" }}
			>
				{listing.imgUrls.map((url, index) => {
					return (
						<SwiperSlide key={index}>
							<div
								className={styles.swiperSlideDiv}
								style={{
									background: `url(${listing.imgUrls[index]}) center no-repeat`,
									backgroundSize: "cover",
								}}
							></div>
						</SwiperSlide>
					);
				})}
			</Swiper>

			<div
				className={styles.shareIconDiv}
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 2000);
				}}
			>
				<img src={shareIcon} alt='' />
			</div>
			{shareLinkCopied && <p className={styles.linkCopied}>Link Copied!</p>}

			<div className={styles.listingDetails}>
				<div className={styles.listingDetailsBox}>
					<p className={styles.listingName}>
						{listing.name} - $
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
					</p>
					<div className={styles.listinglabels}>
						{listing.offer && (
							<p className={styles.discountPrice}>
								${listing.regularPrice - listing.discountedPrice} discount
							</p>
						)}
						<p className={styles.listingType}>
							For {listing.type === "rent" ? "Rent" : "Sale"}
						</p>
					</div>
				</div>
				<p className={styles.listingLocation}>{listing.location}</p>

				<ul className={styles.listingDetailsList}>
					<li className='listingDetailDiv'>
						<BsHouse size={20} style={{ marginRight: "1rem" }} />
						{listing.area}m²
					</li>
					<li className='listingDetailDiv'>
						<IoBedOutline size={20} style={{ marginRight: "1rem" }} />
						{listing.bedrooms > 1
							? `${listing.bedrooms} Bedrooms`
							: "1 Bedroom"}
					</li>
					<li className={styles.listingDetailDiv}>
						<BiBath size={20} />
						{listing.bathrooms > 1
							? `${listing.bathrooms} Bathrooms`
							: "1 Bathroom"}
					</li>
					<li className={styles.listingDetailDiv}>
						<TbParking size={20} />
						{listing.parking && "Parking Spot"}
					</li>
					<li className={styles.listingDetailDiv}>
						<MdOutlineChair size={20} />
						{listing.furnished && "Furnished"}
					</li>
					<li className={styles.listingDetailDiv}>
						<BiBuildings size={20} />
						{listing.floor}
					</li>
					<li className={styles.listingDetailDiv}>
						<MdBalcony size={20} />
						{listing.balcony && "Balcony"}
					</li>
					{listing.garden && (
						<li className={styles.listingDetailDiv}>
							<GiHighGrass size={20} />
							Garden
						</li>
					)}
				</ul>

				{/* <p className='listingLocationTitle'>Location</p> */}

				{/* Map */}
				<div className={styles.leafletContainer}>
					<MapContainer
						style={{ height: "100%", width: "100%" }}
						center={[listing.geolocation.lat, listing.geolocation.lng]}
						zoom={14}
						scrollWheelZoom={false}
					>
						<TileLayer
							attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}'
							accessToken={process.env.REACT_APP_LEAFLET_API_KEY}
						/>

						<Marker
							position={[listing.geolocation.lat, listing.geolocation.lng]}
						>
							<Popup>{listing.location}</Popup>
						</Marker>
					</MapContainer>
				</div>

				{auth.currentUser?.uid !== listing.userRef && (
					<div>
						<Link
							to={`/contact/${listing.userRef}?listingName=${listing.name}`}
							className={styles.primaryButton}
						>
							Contact Owner
						</Link>
					</div>
				)}
			</div>
		</main>
	);
}

export default Listing;
