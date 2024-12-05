import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../Store/CartSlice";
import "./Cart.css";
import { FaTractor, FaTrash } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems); // Get cart items from Redux store
  const [productDetails, setProductDetails] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const shippingCost = 50;

  useEffect(() => {
    setProductDetails(cartItems);
    calculateSubtotal(cartItems);
  }, [cartItems]);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
              <div className="cart-item" key={`${item.productId}-${item.colorId}`}>
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
                      <FaTrash/>
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
            {/* <div className="card-payment-methods">
              <span>💳</span>
              <span>Visa</span>
              <span>PayPal</span>
            </div>
            <input type="text" placeholder="Cardholder's Name" />
            <input type="text" placeholder="Card Number" />
            <div className="card-details">
              <input type="text" placeholder="Expiration" />
              <input type="text" placeholder="CVV" />
            </div> */}
           
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
                <span>--------------------------------------------------------------------------</span>
            </div>
              <p>
                Total: <span>₹{(subtotal + shippingCost).toFixed(2)}</span>
              </p>
            </div>
            <button className="checkout-btn">
              ₹{(subtotal + shippingCost).toFixed(2)} CHECKOUT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
