import React from "react";
// import image from "../../Assests/logo-no-background.png";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Login/AuthContext"; // Import the useAuth hook

function Navbar() {
  const { token, role, setToken } = useAuth(); // Get token and role from AuthContext
 const navigate=useNavigate();
  const handleLogout = () => {
    // Logic to handle logout
    localStorage.removeItem('token'); // Remove token from local storage
    setToken(null);
    navigate('/auth')
    // Optionally, you might want to update the state in AuthContext to reflect the logout
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="navbar-left">
          <div className="logo-text">Style Thread</div>
          <ul className="navbar-nav ml-5">
            <li className="nav-item active">
              <Link to="/home" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item active">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item active">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
            {role === "Administrator" && (
              <li className="nav-item active">
                <Link to="/productList" className="nav-link">
                  Product Management
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="navbar-center">
          <div className="searchbox">
            <input placeholder="search here" className="input" />
          </div>
        </div>
        <div className="navbar-right">
          <div className="auth-buttons">
            {token ? (
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/auth" className="nav-link">
                  Login
                </Link>
                <Link to="/auth" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
