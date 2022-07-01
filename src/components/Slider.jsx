import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "./Spinner";
// swiper
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";
import styles from "./Slider.module.scss";

function Slider() {
	const [loading, setLoading] = useState(false);
	const [listings, setListings] = useState(null);
	const [size, setSize] = useState(3);

	const navigate = useNavigate();

	useEffect(() => {
		if (window.innerWidth < 800) {
			setSize(1);
		} else {
			setSize(3);
		}
	}, []);

	useEffect(() => {
		const fetchListings = async () => {
			const listingsRef = collection(db, "listings");
			const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
			const querySnap = await getDocs(q);
			// console.log(querySnap);

			let listings = [];

			querySnap.forEach((doc) => {
				// console.log(doc);
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			// console.log(listings);
			setListings(listings);
			setLoading(false);
		};

		fetchListings();
	}, []);

	if (loading) {
		return <Spinner />;
	}

	// if(listings.length === 0) {
	// 	return <Fragment>

	// 	</Fragment>
	// }

	return (
		listings && (
			<Fragment>
				{/* <p className='exploreHeading'>Recommended</p> */}

				<Swiper
					className={styles.swipercontainer}
					modules={[Navigation, Pagination, Scrollbar, A11y]}
					slidesPerView={size}
					spaceBetween={20}
					pagination={{ clickable: true }}
					// scrollbar={{ draggable: true }}
					// navigation
					autoplay={{
						delay: 1000,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					// style={{ height: "300px" }}
				>
					{listings.map(({ data, id }) => {
						return (
							<SwiperSlide
								key={id}
								onClick={() => navigate(`/category/${data.type}/${id}`)}
							>
								<div
									style={{
										background: `url(${data.imgUrls[0]}) center no-repeat`,
										backgroundSize: "cover",
									}}
									className={styles.swiperSlideDiv}
								>
									<p className={styles.swiperSlideText}>{data.name}</p>
									<p className={styles.swiperSlidePrice}>
										${data.discountedPrice ?? data.regularPrice}{" "}
										{data.type == "rent" && "/ month"}
									</p>
								</div>
							</SwiperSlide>
						);
					})}
				</Swiper>
			</Fragment>
		)
	);
}

export default Slider;
