import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const loggedIn = useSelector((state) => state.auth.user);

  if (loggedIn === undefined) {
    return <div>Loading</div>; // or loading indicator/spinner/etc
  }

  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
