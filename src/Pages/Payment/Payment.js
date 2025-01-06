import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [amount, setAmount] = useState(500); // Amount in INR (500 = 500 INR)

  const handlePayment = async () => {
    try {
      // Step 1: Request order from the backend
      const response = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: amount,
      });

      const orderId = response.data.orderId;

      // Step 2: Open Razorpay checkout
      const options = {
        key: "YOUR_KEY_ID", // Your Razorpay key ID
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Your Company Name",
        description: "Payment for Order",
        order_id: orderId,
        handler: async (response) => {
          // Step 3: After payment, verify the payment signature on the backend
          try {
            const paymentResponse = await axios.post("http://localhost:5000/api/payment/verify-payment", {
              orderId: response.order_id,
              paymentId: response.payment_id,
              signature: response.signature,
            });
            alert(paymentResponse.data.message); // Show success message
          } catch (error) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Your address here",
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Payment initiation failed");
    }
  };

  return (
    <div>
      <h1>Pay {amount} INR</h1>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;
