import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Store/CartSlice";
import { useParams, useNavigate } from "react-router-dom";
import { product } from "../../Store/GenericStore";
import Loader from "../../Shared/Loader";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const productData = useSelector((state) => state?.products?.list || []);
  const fetchProduct = productData?.find(
    (item) => item.productId === parseInt(id)
  );
  const [selectedColorVariant, setSelectedColorVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeSelectionError, setSizeSelectionError] = useState(false);

  useEffect(() => {
    if (fetchProduct) {
      const defaultVariant = fetchProduct.productVariants?.[0];
      setSelectedColorVariant(defaultVariant);
      setSelectedImage(defaultVariant?.image?.[0]);
    }
  }, [fetchProduct]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!productData || productData.length === 0) {
          await dispatch(product("api/Products"));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProductData();
  }, [dispatch, productData]);

  const handleColorSelect = (variant) => {
    setSelectedColorVariant(variant);
    setSelectedImage(variant?.image?.[0]); // Set first image of selected variant
    setSelectedSize(null); // Reset size when color changes
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeSelectionError(false); // Reset error when size is selected
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeSelectionError(true); // Show error if no size is selected
      return;
    }

    if (selectedColorVariant) {
      const cartItem = {
        productId: fetchProduct.productId,
        name: fetchProduct.name,
        image: selectedColorVariant.image[0],
        price: selectedColorVariant.salePrice,
        colorId: selectedColorVariant.colorId,
        sizeId: selectedSize.sizeId,
        quantity: 1,
      };
      dispatch(addToCart(cartItem));
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (selectedSize) {
      navigate("/cart");
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

  return (
    <div className="product-detail-page">
      <div className="left-column">
        <div className="main-image">
          <img
            src={selectedImage || "/path/to/default-image.jpg"}
            alt="Main Product"
          />
        </div>
        <div className="thumbnail-images">
          {selectedColorVariant?.image?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleImageClick(image)}
              className="thumbnail"
            />
          ))}
        </div>
      </div>

      <div className="right-column">
        <h1>{fetchProduct.name}</h1>
        <div className="price">
          ₹{selectedColorVariant?.salePrice}{" "}
          <span className="original-price">₹{selectedColorVariant?.price}</span>
        </div>

        {/* Color Options */}
        <div className="color-options">
          <span>Colors</span>
          <div className="color-swatches">
            {fetchProduct.productVariants?.map((variant, index) => {
              // Assuming each variant has an associated image URL in variant.image[0]
              const variantImage = variant?.image?.[0]; // Default to the first image in the variant
              return (
                <div
                  key={index}
                  className="color-swatch"
                  onClick={() => handleColorSelect(variant)}
                >
                  <img
                    src={variantImage || "/path/to/default-image.jpg"} // Fallback image if variant image is not available
                    alt={`Variant ${index + 1}`}
                    className="color-swatch-image"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Size Options */}
        <div className="size-options">
          <span>Sizes</span>
          <div className="sizes">
            {selectedColorVariant?.productVariantSizes?.map(
              (sizeObj, index) => (
                <button
                  key={index}
                  className={`size ${
                    selectedSize?.sizeId === sizeObj.sizeId ? "selected" : ""
                  }`}
                  onClick={() => handleSizeSelect(sizeObj)}
                >
                  {sizeObj.sizeId}
                </button>
              )
            )}
          </div>
          {sizeSelectionError && (
            <p className="error-message">Please select a size.</p>
          )}
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>

        {/* Accordion */}
        <div className="accordion">
          <details>
            <summary>Details</summary>
            <p>{fetchProduct.description}</p>
          </details>
          <details>
            <summary>Shipping & Returns</summary>
            <p>Free returns within 30 days.</p>
          </details>
          <details>
            <summary>Specifications</summary>
            <ul>
              {fetchProduct.specifications?.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
