import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const productData = useSelector((state) => state?.products?.list || []); // Get the product data from the Redux store
  const product = productData?.find((item) => item.productId === parseInt(id)); // Find the product by ID
  const [selectedImage, setSelectedImage] = useState(
    product?.productVariants?.[0]?.image[0]
  );
  const magnifierRef = useRef(null);

  useEffect(() => {
    if (productData.length === 0) {
      dispatch(product("api/Products")).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      setSelectedImage(product?.productVariants?.[0]?.image[0]);
    }
  }, [dispatch, product, productData.length]);

  const handleImageClick = (image) => {
    setSelectedImage(image); // Update the selected image when a thumbnail is clicked
  };

  const handleMouseEnter = () => {
    magnifierRef.current.style.display = "block";
  };

  const handleMouseMove = (e) => {
    const mainImage = e.target;
    const magnifier = magnifierRef.current;
    const { left, top, width, height } = mainImage.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const bgPosX = (x / width) * 100;
    const bgPosY = (y / height) * 100;

    magnifier.style.backgroundImage = `url(${selectedImage})`;
    magnifier.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
    magnifier.style.left = x - magnifier.offsetWidth / 2 + "px";
    magnifier.style.top = y - magnifier.offsetHeight / 2 + "px";
  };

  const handleMouseLeave = () => {
    magnifierRef.current.style.display = "none";
  };

  if (loading) {
    return (
      <div className="center-loader">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const variant = product?.productVariants?.[0];

  return (
    <div className="product-page">
      <div className="product-images">
        <div className="main-image">
          <img
            src={selectedImage}
            alt="Main Product"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          <div className="magnifier" ref={magnifierRef}></div>
        </div>
        <div className="thumbnail-images">
          {variant?.image.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      </div>
      <div className="product-info">
        <h4>{product.description?.slice(0, 50) + "..."}</h4>
        <div className="price-section">
          <span className="price">₹{variant?.salePrice}</span>
          <span className="original-price">₹{variant?.price}</span>
          <span className="discount">{variant?.discount}% off</span>
        </div>
        <div className="ratings">
          <span className="rating">3.9</span>
          <span className="ratings-count">14,436 ratings and 591 reviews</span>
          <span className="assured">Assured</span>
        </div>
        <div className="color-options">
          <span>Color</span>
          <div className="color-thumbnails">
            {product.productVariants?.map((variant, index) => (
              <img
                key={index}
                src={variant.image[0]} // Assuming image[0] is the first image
                alt={`Color ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="size-options">
          <span>Size</span>
          <div className="sizes">
            {variant?.productVariantSizes?.map((sizeObj, index) => (
              <button key={index} className="size">
                {/* Replace sizeId with actual size names if needed */}
                {sizeObj.sizeId}
              </button>
            ))}
          </div>
        </div>
        <div className="offers">
          <h2>Available offers</h2>
          <ul>
            <li>
              Bank Offer Get ₹50 Instant Discount on first Flipkart UPI
              transaction on order of ₹200 and above T&C
            </li>
            <li>
              Bank Offer Flat ₹1000 off on HDFC Bank Credit Card EMI Txns,
              Tenure: 6 and 9 months, Min Txn Value: ₹15,000 T&C
            </li>
            <li>
              Bank Offer Flat ₹1250 off on HDFC Bank Credit Card EMI Txns,
              Tenure: 12 and 18 months, Min Txn Value: ₹15,000 T&C
            </li>
            <li>
              Partner Offer Make a purchase and enjoy a surprise cashback/
              coupon that you can redeem later! Know More
            </li>
            <li>+18 more offers</li>
          </ul>
        </div>
        <div className="purchase-section">
          <button className="add-to-cart">ADD TO CART</button>
          <button className="buy-now">BUY NOW</button>
        </div>
        <div className="delivery-section">
          <span>
            Delivery by <strong>4 Aug, Sunday</strong> | Free{" "}
            <strong>₹40</strong> if ordered before 8:34 PM
          </span>
          {/* <span>Cash on Delivery available</span> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
