import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAdmin } from "../auth/auth"; 
import AuthPopup from "../auth/AuthPopup";
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
      const userRole = isAdmin() ? "Admin" : "User";
      setPopupMessage(`Welcome ${userRole}! Login successful.`);
      setShowPopup(true);
      
      setTimeout(() => {
        setShowPopup(false);
        if (isAdmin()) {
          nav("/admin");
        } else {
          nav("/user");
        }
      }, 2000);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} className="login-logo" />

      <div className="login-box">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
      {showPopup && <AuthPopup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
  );
}
