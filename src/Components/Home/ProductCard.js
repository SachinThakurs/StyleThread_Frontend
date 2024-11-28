import React, { useState, useEffect } from "react";
import './ProductCard.css';

const ProductCard = ({ product, onCardClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = product?.productVariants?.[0]?.image || []; // Assuming productVariants is an array of objects

  useEffect(() => {
    let intervalId;

    if (hovered && images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 1000); // Change image every second
    }

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [hovered, images.length]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setCurrentImageIndex(0);
  };

  const handleClick = () => {
    onCardClick(product); // Pass the product object to the onCardClick function
  };

  const variant = product?.productVariants?.[0]; // Get the first variant if available

  return (
    <div
      className="card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {images.length > 0 && (
        <img
          className="card-img-top"
          src={images[currentImageIndex]}
          alt="Product"
        />
      )}

      <div className="card-bodys">
        <p className="card-text">
          <span className="sponsored">Sponsored</span>
          <br />
          <span className="description">
            {product.description?.slice(0, 35) + "..."}
          </span>
          <br />
          Color:{" "}
          <span className="sponsored">
            {variant?.colorId} {/* Assuming colorId is a numerical ID */}
          </span>
          <br />
          <span style={{ fontSize: "20px", fontWeight: "600" }}>
            ₹{variant?.salePrice}
          </span>{" "}
          &nbsp;
          <span
            style={{
              textDecoration: "line-through",
              fontSize: "15px",
              width: "2%",
            }}
          >
            ₹{variant?.price}
          </span>
          &nbsp;
          <span
            style={{ color: "#16db16", fontSize: "15px", fontWeight: "600" }}
          >
            {variant?.discount}% off
          </span>
          <br />
          <span className="sponsored">Free Delivery</span>
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
