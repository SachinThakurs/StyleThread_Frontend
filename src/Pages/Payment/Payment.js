import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [amount, setAmount] = useState(500); // Amount in INR (500 = 500 INR)
  const [referenceId, setReferenceId] = useState("order-12345");
  const [description, setDescription] = useState("Payment for Order");
  const [customer, setCustomer] = useState({
    name: "John Doe",
    contact: "9999999999",
    email: "john@example.com",
  });

  const handlePayment = async () => {
    try {
      // Step 1: Request payment link from the backend
      const response = await axios.post(
        "https://localhost:44314/api/Payment/GetPaymentLink",
        {
          amount: amount,
          referenceId: referenceId,
          description: description,
          customer: customer,
          reminderEnable: true,
          callbackUrl: "http://localhost:3000/home", // replace with your actual callback URL
          callbackMethod: "POST", // You can adjust the method (GET/POST)
        }
      );

      // Step 2: Open Razorpay checkout with payment link URL (if required)
      const paymentLink = response.data.paymentLink; // Assuming the response contains paymentLink URL

      // If Razorpay integration is required for a URL:
      const options = {
        key: "YOUR_KEY_ID", // Your Razorpay key ID
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Your Company Name",
        description: description,
        order_id: referenceId,
        handler: async (paymentResponse) => {
          try {
            const verificationResponse = await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              {
                orderId: paymentResponse.order_id,
                paymentId: paymentResponse.payment_id,
                signature: paymentResponse.signature,
              }
            );
            alert(verificationResponse.data.message); // Show success message
          } catch (error) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.contact,
        },
        notes: {
          address: "Your address here",
        },
        theme: {
          color: "#F37254",
        },
      };

      // If Razorpay is needed to be triggered on a link:
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
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
