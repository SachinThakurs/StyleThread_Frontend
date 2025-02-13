import React, { useState } from "react";
import profileImage from '../../Assests/people.png';
import "./Profile.css";

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-card">
            <img src={profileImage} alt="User Profile" className="profile-img" />
            <h2 className="profile-name">John Doe</h2>
            <p className="profile-email">Email: johndoe@example.com</p>
            <p className="profile-phone">Phone: +91 9876543210</p>
            <button className="edit-btn">Edit Profile</button>
          </div>
        );
      case 'orderHistory':
        return (
          <div className="order-history">
            <h3 className="section-title">Order History</h3>
            <ul className="order-list">
              <li className="order-item">Order #1234 - T-Shirt - $20</li>
              <li className="order-item">Order #1235 - Jeans - $40</li>
              <li className="order-item">Order #1236 - Sneakers - $60</li>
            </ul>
          </div>
        );
      case 'savedAddresses':
        return (
          <div className="saved-addresses">
            <h3 className="section-title">Saved Addresses</h3>
            <div className="address-list">
              <p className="address-item">123, Street Name, City, Country</p>
              <p className="address-item">Apartment 4B, Complex Name, Another City</p>
            </div>
          </div>
        );
      case 'wishlist':
        return (
          <div className="wishlist">
            <h3 className="section-title">Wishlist</h3>
            <ul className="wishlist-list">
              <li className="wishlist-item">Leather Jacket - $120</li>
              <li className="wishlist-item">Sneakers - $80</li>
              <li className="wishlist-item">Denim Jeans - $50</li>
            </ul>
          </div>
        );
      case 'accountSettings':
        return (
          <div className="account-settings">
            <h3 className="section-title">Account Settings</h3>
            <p className="settings-item">Change Password</p>
            <p className="settings-item">Manage Payment Methods</p>
            <p className="settings-item">Subscription Preferences</p>
          </div>
        );
      case 'help':
        return (
          <div className="help">
            <h3 className="section-title">Help</h3>
            <p className="help-item">Frequently Asked Questions</p>
            <p className="help-item">Contact Support</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="side-panel">
        <ul className="side-panel-list">
          <li className="side-panel-item" onClick={() => setActiveTab('profile')}>Profile</li>
          <li className="side-panel-item" onClick={() => setActiveTab('orderHistory')}>Order History</li>
          <li className="side-panel-item" onClick={() => setActiveTab('savedAddresses')}>Saved Addresses</li>
          <li className="side-panel-item" onClick={() => setActiveTab('wishlist')}>Wishlist</li>
          <li className="side-panel-item" onClick={() => setActiveTab('accountSettings')}>Account Settings</li>
          <li className="side-panel-item" onClick={() => setActiveTab('help')}>Help</li>
        </ul>
      </div>

      <div className="main-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Profile;
