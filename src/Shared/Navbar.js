import React from "react";
// import image from "../../Assests/logo-no-background.png";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Pages/Login/AuthContext"; // Import the useAuth hook
import { useSelector } from "react-redux";
import shoppingCart from '../Assests/online-shopping.png'
import { showToast } from "../Utils/Helper/ToastNotifications";
import peopleIcon from "../Assests/people.png";
import stylethread from "../Assests/STW_Logo.png";

function Navbar() {
  const { token, role, setToken } = useAuth(); // Get token and role from AuthContext
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Get the total number of items in the cart

  const handleLogout = () => {
    // Logic to handle logout
    localStorage.removeItem("token"); // Remove token from local storage
    setToken(null);
    navigate("/auth");
    // Optionally, you might want to update the state in AuthContext to reflect the logout
  };

  const handleCartClick = (event) => {
    if (!token) {
      event.preventDefault(); // Stop navigation
      showToast("error", "Please Login first.");
    } else {
      navigate("/cart"); // Navigate to cart if logged in
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="navbar-left">
        <div className="ST-Logo">
        <Link to="/home" className="nav-link">
                <img src={stylethread} alt="peopleIcon"/>
                </Link>
            </div>
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
          <div className="cart-icon">
            <Link to="/cart" onClick={handleCartClick}>
              <img src={shoppingCart} alt="shoppingCart"/>
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span> // Display the cart count
              )}
            </Link>
          </div>
          {role === "Visitor" && (
              <div className="profile-icon">
              <Link to="/profile">
                <img src={peopleIcon} alt="peopleIcon"/>
              </Link>
              </div>
          )}
         
          <div className="auth-buttons">
            {token ? (
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/auth" className="nav-link">
                  Sign In
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
