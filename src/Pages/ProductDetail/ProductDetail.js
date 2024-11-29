import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Store/CartSlice"; // Import the addToCart action
import Loader from "../../Shared/Loader";
import "./ProductDetail.css";
import { useParams } from "react-router-dom";
import { product } from "../../Store/GenericStore"; // Ensure proper import

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const productData = useSelector((state) => state?.products?.list || []); // Get the product data from the Redux store
  const fetchProduct = productData?.find((item) => item.productId === parseInt(id)); // Find the product by ID
  const [selectedImage, setSelectedImage] = useState(null); // Initialize with null
  const magnifierRef = useRef(null);

  // Update selected image when product data changes
  useEffect(() => {
    if (fetchProduct) {
      const defaultImage = fetchProduct?.productVariants?.[0]?.image?.[0];
      setSelectedImage(defaultImage || "/path/to/default-image.jpg"); // Set to default image if unavailable
    }
  }, [fetchProduct]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!productData || productData.length === 0) {
          // Dispatch an action to fetch all products
          await dispatch(product("api/Products"));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false); // Ensure loading is turned off even if an error occurs
      }
    };

    fetchProductData();
  }, [dispatch, productData]);

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

  const handleAddToCart = () => {
    const variant = fetchProduct?.productVariants?.[0]; // Assume the first variant for simplicity
    if (variant) {
      const cartItem = {
        productId: fetchProduct.productId,
        name: fetchProduct.name,
        image: variant.image[0],
        price: variant.salePrice,
        colorId: variant.colorId,
        quantity: 1,
      };

      // Dispatch the action to add the product to the cart
      dispatch(addToCart(cartItem));
    }
  };

  if (loading) {
    return (
      <div className="center-loader">
        <Loader />
      </div>
    );
  }

  if (!fetchProduct) {
    return <div>Product not found</div>;
  }

  const variant = fetchProduct?.productVariants?.[0];

  return (
    <div className="product-page">
      <div className="product-images">
        <div className="main-image">
          <img
            src={selectedImage || "/path/to/default-image.jpg"}
            alt="Main Product"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          <div className="magnifier" ref={magnifierRef}></div>
        </div>
        <div className="thumbnail-images">
          {variant?.image?.map((image, index) => (
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
        <h4>{fetchProduct.description?.slice(0, 50) + "..."}</h4>
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
            {fetchProduct.productVariants?.map((variant, index) => (
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
                {sizeObj.sizeId}
              </button>
            ))}
          </div>
        </div>
        <div className="purchase-section">
          <button className="add-to-cart" onClick={handleAddToCart}>
            ADD TO CART
          </button>
          <button className="buy-now">BUY NOW</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
