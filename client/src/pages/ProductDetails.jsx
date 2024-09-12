import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast"; // For displaying success messages
import "../styles/Productstyles.css";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [cart, setCart] = useCart(); // Access cart context

  // Initial product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // Fetch product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to add product to cart
  const handleAddToCart = () => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Item Added to cart");
  };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button className="btn btn-secondary ms-1" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
