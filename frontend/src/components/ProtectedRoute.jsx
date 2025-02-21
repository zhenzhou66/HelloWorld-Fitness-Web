import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return storedUser ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
