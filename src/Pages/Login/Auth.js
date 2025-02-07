import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import axios from "axios";
import { useAuth } from "./AuthContext";
import LoadingBar from "react-top-loading-bar";
import { showToast } from "./../../Utils/Helper/ToastNotifications"; // Import your toast utility
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Auth = () => {
  const ref = useRef(null); // Reference for the loading bar
  const { setToken } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      address: "",
      phoneNumber: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    ref.current.continuousStart(); // Start the loading bar

    const apiUrl = isSignIn
      ? "https://localhost:44314/api/Auth/Login"
      : "https://localhost:44314/api/Auth/Register";

    const requestBody = {
      Entity: isSignIn
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            userName: formData.userName,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            address: formData.address,
            phoneNumber: formData.phoneNumber
          }
    };

    try {
      const response = await axios.post(apiUrl, requestBody);
      if (response.data.success === false) {
        showToast("Error:", response.data.message);
      } else if (response.data.success === true) {
        const token = response.data.content;
        if (token != null) {
          localStorage.setItem("token", token);
          localStorage.setItem("auth", JSON.stringify(response.data.content));
          setToken(token);
          // setTimeout(function () {
            showToast(
              "success",
              isSignIn ? "Sign In Successful" : "Sign Up Successful"
            );
            navigate("/home");
          // }, 3000);
        } else if (response.data.success == true) {
          showToast("success", response.data.message);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      // setTimeout(function () {
        ref.current.complete(); // Complete the loading bar
      // }, 1000);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <LoadingBar color="#f11946" ref={ref} />
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="auth-left">
        <div className="quote-content">
          <p className="quote-label">A WISE QUOTE</p>
          <h1 className="quote-title">Get Everything You Want</h1>
          <p className="quote-subtitle">
            You can get everything you want if you work hard, trust the process,
            and stick to the plan.
          </p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-header">
          <h2>{isSignIn ? "Welcome Back" : "Create an Account"}</h2>
          <p className="auth-description">
            {isSignIn
              ? "Enter your email and password to access your account"
              : "Fill in the fields to create a new account"}
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
              <div className="form-group">
                <label>User Name</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your user name"
                  required
                />
              </div>
            </>
          )}
          {!isSignIn && (
            <div className="form-group-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
          )}
          <div className="form-group-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          {!isSignIn && (
            <>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    // Ensure the input is not longer than 10 characters
                    if (e.target.value.length <= 10) {
                      handleChange(e);
                    }
                  }}
                  placeholder="Enter your phone number"
                  maxLength="10" // Restricts maximum length for the input
                />
              </div>
            </>
          )}
          {isSignIn && (
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="toggle-text">
          {isSignIn ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm}>{isSignIn ? "Sign Up" : "Sign In"}</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
