import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAdmin, isUser } from "../auth/auth"; 
import "./login.css";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    const success = await login(email, password);  
    if (success) {
      let userRole = "Guest";
      if (isAdmin()) userRole = "Admin";
      else if (isUser()) userRole = "User";

      
      setTimeout(() => {
        setShowPopup(false);
        if (isAdmin()) {
          nav("/admin");
        } else if (isUser()) {
          nav("/user");
        } else {
          nav("/"); // fallback
        }
      }, 2000);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} className="login-logo" alt="Logo" />

      <div className="login-box">
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>

    </div>
  );
}
