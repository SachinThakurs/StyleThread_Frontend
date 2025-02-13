import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../Store/CartSlice";
import axios from "axios"; // Import axios for API requests
import "./Cart.css";
import { FaTrash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [productDetails, setProductDetails] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const shippingCost = 50;

  useEffect(() => {
    setProductDetails(cartItems);
    calculateSubtotal(cartItems);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateSubtotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  };

  const handleQuantityChange = (productId, colorId, quantity) => {
    if (quantity > 0 && quantity <= 5) {
      dispatch(updateCartItemQuantity({ productId, colorId, quantity }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };
  const handleCheckout = async () => {
    try {
      // Retrieve client data from localStorage
      const token = localStorage.getItem("auth");

      if (!token) {
        alert("Client information is missing. Please log in.");
        return;
      }

      let clientData;
      try {
        clientData = jwtDecode(token);
      } catch (error) {
        console.error("Invalid token", error);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token"); // Clear invalid token
        return;
      }

      // Validate required values
      if (typeof subtotal !== "number" || typeof shippingCost !== "number") {
        console.error("Subtotal or shippingCost is not defined properly.");
        alert("Invalid cart details. Please refresh and try again.");
        return;
      }

      // Prepare the request payload according to the new API requirements
      const payload = {
        amount: subtotal + shippingCost, // Ensure this is a valid number
        referenceId: `order-${Date.now()}`, // Unique reference ID for the order
        description: "Payment for Order", // Order description
        customer: {
          name: `${clientData.iss} ${clientData.lastName}`, // Customer's full name
          contact: "", // Ensure phoneNumber exists
          email: clientData.sub
        },
        reminderEnable: true, // Enable reminder (set as per your requirement)
        callbackUrl: "http://localhost:3000/home", // Replace with your actual callback URL
        callbackMethod: "get" // HTTP method for the callback
      };

      console.log("Sending checkout request with payload:", payload);

      // API call to GetPaymentLink endpoint
      const response = await axios.post(
        "https://localhost:44314/api/Payment/GetPaymentLink",
        payload,
        {
          headers: {
            "Content-Type": "application/json"
            // "Authorization": `Bearer ${token}` // Uncomment if the API requires authentication
          }
        }
      );

      // Handle successful response
      if (response.status === 200 && response.data.content) {
        console.log("Order Response:", response.data);
        const paymentLink = response.data.content.shortUrl;

        if (paymentLink) {
          window.open(paymentLink, "_blank");
        } else {
          alert("Invalid payment link received.");
        }
      } else {
        console.error("Unexpected API response:", response.data);
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error during checkout:",
        error.response?.data || error.message
      );
      alert(
        `Checkout error: ${
          error.response?.data?.message || "Please try again."
        }`
      );
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-items-section">
          <h2>Shopping Cart</h2>
          <p>You have {productDetails.length} items in your cart</p>
          <div
            className={`cart-items ${
              productDetails.length > 3 ? "cart-items-scrollable" : ""
            }`}
          >
            {productDetails.map((item) => (
              <div
                className="cart-item"
                key={`${item.productId}-${item.colorId}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-desc">{item.description}</p>
                  <p className="cart-item-price">₹{item.price}</p>
                  <div className="cart-item-actions">
                    <label>
                      Quantity:
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            item.colorId,
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        max="5"
                      />
                    </label>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.productId)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Summary</h3>
            <div className="summary-totals">
              <p>
                Subtotal: <span>₹{subtotal.toFixed(2)}</span>
              </p>
              <p>
                Shipping Discount: <span>-₹20.00</span>
              </p>
              <p>
                Shipping: <span>₹{shippingCost.toFixed(2)}</span>
              </p>
              <p>
                Tax (Calculated at checkout): <span>₹20.00</span>
              </p>
              <div>
                <span>
                  --------------------------------------------------------------------------
                </span>
              </div>
              <p>
                Total: <span>₹{(subtotal + shippingCost).toFixed(2)}</span>
              </p>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              ₹{(subtotal + shippingCost).toFixed(2)} CHECKOUT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
