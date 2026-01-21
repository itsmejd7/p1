import {useNavigate} from "react-router-dom";
import {logout} from "../auth/auth.js";
import "./NavBar.css";

export function NavBar(){
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return(
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-brand">
            <img 
              src="https://www.purppledesigns.com/wp-content/uploads/2023/11/download-4.png" 
              alt="Tata Motors" 
              className="navbar-logo"
            />
            <span className="brand-name">Tata Motors</span>
          </div>
          

        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}