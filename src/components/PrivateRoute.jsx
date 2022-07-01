import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus.js";
import Spinner from "./Spinner.jsx";

function PrivateRoute() {
	// destructure custome component
	const { loggedIn, isLoading } = useAuthStatus();
	if (isLoading) {
		return <Spinner />;
	} else {
		// if logged in
		// render Outlet means render child Route => <Profile/>
		// else navigate to Sign In

		return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
	}
}

export default PrivateRoute;
