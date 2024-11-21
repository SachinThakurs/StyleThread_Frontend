import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

const AuthForm = () => {
  const { setToken } = useAuth(); // Get setToken from AuthContext
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsSignUp(true);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
    setFormData({ email: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const apiUrl = isSignUp
      ? 'https://localhost:44314/api/Auth/Register'
      : 'https://localhost:44314/api/Auth/Login';

    const requestBody = {
      entity: {
        email: formData.email,
        password: formData.password,
        ...(isSignUp && { name: formData.name }),
      },
    };

    try {
      const response = await axios.post(apiUrl, requestBody);
      if (response.data.content) {
        const token = response.data.content;
        localStorage.setItem('token', token);
        setToken(token); // Update token in AuthContext
        navigate('/home'); // Redirect to home after successful login
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSubmit} className='forms'>
          <h1>Create Account</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          {isSignUp && (
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit} className='forms'>
          <h1>Sign in</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <a className='forget' href="#">Forgot your password?</a>
          <button type="submit" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
      <footer>
        <p>
          Created with <i className="fa fa-heart"></i> by
          <a target="_blank" rel="noopener noreferrer" href="https://florin-pop.com">Florin Pop</a>
          - Read how I created this and how you can join the challenge
          <a target="_blank" rel="noopener noreferrer" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/">here</a>.
        </p>
      </footer>
    </div>
  );
};

export default AuthForm;
