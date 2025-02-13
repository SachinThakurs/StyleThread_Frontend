import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="footer-heading">About Us</h4>
          <p className="footer-text">We are a company focused on delivering quality products.</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#home" className="footer-link">Home</a></li>
            <li><a href="#about" className="footer-link">About</a></li>
            <li><a href="#services" className="footer-link">Services</a></li>
            <li><a href="#contact" className="footer-link">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Follow Us</h4>
          <ul className="footer-social-links">
            <li><a href="https://facebook.com" className="footer-social-link">Facebook</a></li>
            <li><a href="https://twitter.com" className="footer-social-link">Twitter</a></li>
            <li><a href="https://instagram.com" className="footer-social-link">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-bottom-text">© 2025 Your Company. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
