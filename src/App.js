import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment, Suspence } from "react";
// TOASTIFI
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// COMPONNETS
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Spinner from "./components/Spinner";
// PAGES
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Category from "./pages/Category";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import CreateLisitng from "./pages/CreateLisitng";
import EditListing from "./pages/EditListing";

// const CreateLisitng = React.lazy(() => import("./pages/CreateLisitng"));
// const EditListing = React.lazy(() => import("./pages/EditListing"));

function App() {
	return (
		<Fragment>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Explore />} />
					<Route path='/offers' element={<Offers />} />
					<Route path='/category/:categoryName' element={<Category />} />
					<Route path='/profile' element={<PrivateRoute />}>
						<Route path='/profile' element={<Profile />} />
					</Route>
					<Route path='/sign-in' element={<SignIn />} />
					<Route path='/sign-up' element={<SignUp />} />
					{/* <Suspense fallback={<p>loading</p>}> */}
					<Route path='/forgot-password' element={<ForgotPassword />} />
					<Route path='/create-listing' element={<CreateLisitng />} />
					<Route path='/edit-listing/:listingId' element={<EditListing />} />
					{/* </Suspense> */}
					<Route
						path='/category/:categoryName/:listingId'
						element={<Listing />}
					/>
					<Route path='/contact/:landlordId' element={<Contact />} />
				</Routes>
				<Navbar />
			</BrowserRouter>
			<ToastContainer />
		</Fragment>
	);
}

export default App;
