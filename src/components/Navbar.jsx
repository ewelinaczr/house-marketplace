import { useNavigate, useLocation } from "react-router-dom";
import styles from './Navbar.module.scss'
import React from "react";
import { ReactComponent as OfferIcon } from "./../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "./../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "./../assets/svg/personOutlineIcon.svg";

function Navbar() {
	// onClick navigate to Route
	const navigate = useNavigate();
	const location = useLocation();

	// set active Route
	const pathMatchRoute = (route) => {
		if (route === location.pathname) {
			return true;
		}
	};

	return (
		<footer className={styles.navbar}>
			<nav className={styles.navbarNav}>
				<ul className={styles.navbarListItems}>
					<li
						className={styles.navbarListItem}
						onClick={() => {
							navigate("/");
						}}
					>
						<ExploreIcon
							fill={pathMatchRoute("/") ? "#2c2c2c" : "#8f8f8f"}
							width='20px'
							height='20px'
						/>
						<p
							className={
								pathMatchRoute("/")
									? "navbarListItemNameActive"
									: "navbarListItemName"
							}
						>
							Explore
						</p>
					</li>
					<li
						className={styles.navbarListItem}
						onClick={() => {
							navigate("/offers");
						}}
					>
						<OfferIcon
							fill={pathMatchRoute("/offers") ? "#2c2c2c" : "#8f8f8f"}
							width='20px'
							height='20px'
						/>
						<p
							className={
								pathMatchRoute("/offers")
									? "navbarListItemNameActive"
									: "navbarListItemName"
							}
						>
							Offers
						</p>
					</li>
					<li
						className={styles.navbarListItem}
						onClick={() => {
							navigate("/profile");
						}}
					>
						<PersonOutlineIcon
							fill={pathMatchRoute("/profile") ? "#2c2c2c" : "#8f8f8f"}
							width='20px'
							height='20px'
						/>
						<p
							className={
								pathMatchRoute("/profile")
									? "navbarListItemNameActive"
									: "navbarListItemName"
							}
						>
							Profile
						</p>
					</li>
				</ul>
			</nav>
		</footer>
	);
}

export default Navbar;
