import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

import { IoBedOutline } from "react-icons/io5";
import { BiBath } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import styles from "./ListingItem.module.scss";

function ListingItem({ listing, id, onEdit, onDelete }) {
	const [size, setSize] = useState(20);

	useEffect(() => {
		if (window.innerWidth < 800) {
			setSize(15);
		} else {
			setSize(20);
		}
	}, []);
	// console.log(listing);
	return (
		<li className={styles.categoryListing}>
			<div className={styles.actionsbar}>
				{onDelete && (
					<DeleteIcon
						className={styles.removeIcon}
						fill='rgb(231,76,60)'
						onClick={() => onDelete(listing.id, listing.name)}
					/>
				)}
				{onEdit && (
					<EditIcon
						className={styles.editIcon}
						// fill='rgb(231,76,60)'
						onClick={() => onEdit(listing.id)}
					/>
				)}
			</div>
			<Link
				to={`/category/${listing.type}/${id}`}
				className={styles.categoryListingLink}
			>
				<img
					src={listing.imageUrls ? listing.imageUrls[0] : listing.imgUrls[0]}
					alt={listing.name}
					className={styles.categoryListingImg}
				/>
				<div className={styles.categoryListingDetails}>
					<p className={styles.categoryListingLocation}>{listing.location}</p>
					<p className={styles.categoryListingName}>{listing.name}</p>
					<p className={styles.categoryListingPrice}>
						$
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						{listing.type === "rent" && "/ Month"}
					</p>
					<div className={styles.categoryListingInfoDiv}>
						<div className={styles.categoryListingOnfoBox}>
							<BsHouse size={size} />
							<p className={styles.categoryListingInfoText}>{listing.area}m²</p>
						</div>
						<div className={styles.categoryListingOnfoBox}>
							<IoBedOutline size={size} />
							{/* <img src={bedIcon} alt='bed' /> */}
							<p className={styles.categoryListingInfoText}>
								{listing.bedrooms > 1
									? `${listing.bedrooms} bedrooms`
									: "1 bedroom"}
							</p>
						</div>
						<div className={styles.categoryListingOnfoBox}>
							{/* <img src={bathtubIcon} alt='bath' /> */}
							<BiBath size={size} />
							<p className={styles.categoryListingInfoText}>
								{listing.beathrooms > 1
									? `${listing.beathrooms} beathrooms`
									: "1 bathroom"}
							</p>
						</div>
					</div>
				</div>
			</Link>
			{/* {onDelete && (
				<DeleteIcon
					className={styles.removeIcon}
					fill='rgb(231,76,60)'
					onClick={() => onDelete(listing.id, listing.name)}
				/>
			)}
			{onEdit && (
				<EditIcon
					className={styles.editIcon}
					// fill='rgb(231,76,60)'
					onClick={() => onEdit(listing.id)}
				/>
			)} */}
		</li>
	);
}

export default ListingItem;
