import React from "react";
import styles from "./YourListing.module.scss";
import { useState, useEffect } from "react";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";

function YourListing({ listing, id, onEdit, onDelete }) {
    const [size, setSize] = useState(20);

	useEffect(() => {
		if (window.innerWidth < 800) {
			setSize(15);
		} else {
			setSize(20);
		}
	}, []);
	return (
		<div className={styles.container}>
			<img
				src={listing.imageUrls ? listing.imageUrls[0] : listing.imgUrls[0]}
				alt={listing.name}
				className={styles.image}
			/>
			<div className={styles.details}>
				<div className={styles.actions}>
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
				<p className={styles.location}>{listing.location}</p>
				<p className={styles.name}>{listing.name}</p>
				<p className={styles.price}>
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
			</div>
		</div>
	);
}

export default YourListing;
