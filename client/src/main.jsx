
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import { AuthProvider } from "./context/auth";
import { CartProvider } from "./context/cart";
import "antd/dist/reset.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>

    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  
</AuthProvider>
);
