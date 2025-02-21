import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return storedUser ? <Navigate to="/Dashboard" /> : element;
};

export default PublicRoute;
