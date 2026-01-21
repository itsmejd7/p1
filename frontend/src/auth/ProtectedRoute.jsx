import { Navigate } from "react-router-dom";
import { isAuth, isAdmin, isUser } from "./auth";  

export const ProtectedRoute = ({ children }) => {
  return isAuth() ? children : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/unauthorized" />;
};

export const UserRoute = ({ children }) => {
  return isUser() ? children : <Navigate to="/unauthorized" />;
};