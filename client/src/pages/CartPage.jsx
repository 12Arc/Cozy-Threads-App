import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/Form/CheckoutForm"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "../styles/Cartstyles.css"

const stripePromise = loadStripe("pk_test_51PxV8MKaw2ar0QFZU2Or9kqf2C1YHOzK3J7Q2rp0zFanYR6rLMkqtv4znGxhjqBKgUIQ3Gj8nl4zRBqZr3DR20EH004vQrt2vL");


const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");

  // Calculate total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total += item.price * item.quantity;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout"
                  }`
                : "Your Cart Is Empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row" key={p._id}>
                <div className="col-md-4">
                  <img
                    src={`/api/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    width= "200px" 
                    height= {"200px"}
                  />
                </div>
                <div className="col-md-8">
                  <p>{p.name}</p>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price: {p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total: {totalPrice()} </h4>

            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address: {auth?.user?.address}</h4>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Please Login to checkout
                  </button>
                )}
              </div>
            )}

            {/* Checkout Form */}
            {auth?.token && cart?.length > 0 && (
              <Elements stripe={stripePromise}>
                <CheckoutForm /> {/* Use CheckoutForm component here */}
              </Elements>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
