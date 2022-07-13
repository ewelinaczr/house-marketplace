import React from "react";
import { Link } from "react-router-dom";
import rentCategoryImage from "./../assets/jpg/rent.jpg";
import sellCategoryImage from "./../assets/jpg/rent1.jpg";
import Slider from "../components/Slider";
import styles from "./Explore.module.scss";

function Explore() {
	return (
		<div className={styles.explore}>
			{/* <header>
				<p className='pageHeader'>Explore</p>
			</header> */}
			<main>
				<Slider />
				{/* <p className='exploreCaregoryHeading'>Categories</p> */}
				<div className={styles.exploreCategories}>
					<Link to='/category/rent'>
						<div className={styles.exploreCategoryBox}>
							<img
								className={styles.exploreCategoryImg}
								src={rentCategoryImage}
								alt='house for rent'
							/>
							<p className={styles.exploreCategoryName}>Places for rent</p>
						</div>
					</Link>
					<Link to='/category/sale'>
						<div className={styles.exploreCategoryBox}>
							<img
								className={styles.exploreCategoryImg}
								src={sellCategoryImage}
								alt='house for sell'
							/>
							<p className={styles.exploreCategoryNameSale}>Places for sale</p>
						</div>
					</Link>
				</div>
			</main>
		</div>
	);
}

export default Explore;
