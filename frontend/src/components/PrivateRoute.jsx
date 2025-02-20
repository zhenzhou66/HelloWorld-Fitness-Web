import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const storedUser = localStorage.getItem("user"); // Check if user data exists

  return storedUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
