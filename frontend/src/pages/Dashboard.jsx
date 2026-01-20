// src/pages/Dashboard.jsx
import { logout } from "../auth/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}