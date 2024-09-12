import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [cart, setCart] = useCart(); // Cart context
  const [auth] = useAuth(); // Auth context
  const [alertMessage, setAlertMessage] = useState("");
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const calculateTotal = () => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return Math.round(total * 100); // Convert to cents and round
  }

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || cart.length <= 0) return;

    try {
      setPaying(true);
      const total = calculateTotal();
      // Step 1: Create payment intent by calling the backend
      const { data } = await axios.post("/api/product/create-payment-intent", {
        amount: total ,
      });

      const clientSecret = data.clientSecret;

      // Step 2: Confirm the card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setPaying(false);

      if (result.error) {
        // Handle the error returned by Stripe
        setAlertMessage(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // Call the backend to confirm the order and save it in the DB
        await axios.post("/api/product/confirm-payment", {
          paymentIntentId: result.paymentIntent.id,
          cart,
          userId: auth.userId
        });

        setAlertMessage("Payment successful");
        setTimeout(() => {
          // Clear the cart and redirect to orders page
          setCart([]);
          localStorage.removeItem("cart");
          navigate("/dashboard/user/orders");
        }, 3000);
      } else {
        setAlertMessage("Payment processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setAlertMessage("Payment failed. Please try again.");
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handlePay}>
      {alertMessage && <div>{alertMessage}</div>}
      <CardElement />
      <button
        className="btn btn-primary mt-3"
        type="submit"
        disabled={paying || cart.length <= 0}
      >
        {paying ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
