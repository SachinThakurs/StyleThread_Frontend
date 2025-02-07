import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Store/CartSlice";
import { useParams, useNavigate } from "react-router-dom";
import { product } from "../../Store/GenericStore";
import Loader from "../../Shared/Loader";
import "./ProductDetail.css";
import ProductCard from "../../Components/ProductCard/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const productData = useSelector((state) => state?.products?.list || []);
  
  const fetchProduct = productData?.find((item) => item.productId === parseInt(id));
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
        if (!productData.length) {
          await dispatch(product("api/Products"));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [dispatch, productData]);

  const handleColorSelect = (variant) => {
    setSelectedColorVariant(variant);
    setSelectedImage(variant?.image?.[0]);
    setSelectedSize(null);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeSelectionError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeSelectionError(true);
      return;
    }
    dispatch(addToCart({
      productId: fetchProduct.productId,
      name: fetchProduct.name,
      image: selectedColorVariant.image[0],
      price: selectedColorVariant.salePrice,
      colorId: selectedColorVariant.colorId,
      sizeId: selectedSize.sizeId,
      quantity: 1,
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (selectedSize) navigate("/cart");
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product.productId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loader className="center-loader" />;
  if (!fetchProduct) return <div>Product not found</div>;

  const relatedProducts = productData.filter((item) => item.productId !== fetchProduct.productId);

  return (
    <>
      <div className="product-detail-page">
        <div className="left-column">
          <div className="main-image">
            <img src={selectedImage || "/default-image.jpg"} alt="Product" />
          </div>
          <div className="thumbnail-images">
            {selectedColorVariant?.image?.map((img, index) => (
              <img key={index} src={img} alt={`Thumbnail ${index + 1}`} className="thumbnail" onClick={() => setSelectedImage(img)} />
            ))}
          </div>
        </div>

        <div className="right-column">
          <h1>{fetchProduct.name}</h1>
          <div className="price">
            ₹{selectedColorVariant?.salePrice} <span className="original-price">₹{selectedColorVariant?.price}</span>
          </div>

          <div className="color-options">
            <span>Colors</span>
            <div className="color-swatches">
              {fetchProduct.productVariants?.map((variant, index) => (
                <img key={index} src={variant.image?.[0] || "/default-image.jpg"} alt="Color" className="color-swatch" onClick={() => handleColorSelect(variant)} />
              ))}
            </div>
          </div>

          <div className="size-options">
            <span>Sizes</span>
            <div className="sizes">
              {selectedColorVariant?.productVariantSizes?.map((sizeObj, index) => (
                <button key={index} className={`size ${selectedSize?.sizeId === sizeObj.sizeId ? "selected" : ""}`} onClick={() => handleSizeSelect(sizeObj)}>
                  {sizeObj.size.sizeName}
                </button>
              ))}
            </div>
            {sizeSelectionError && <p className="error-message">Please select a size.</p>}
          </div>

          <div className="actions">
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
            <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
          </div>

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
              <ul>{fetchProduct.specifications?.map((spec, index) => (<li key={index}>{spec}</li>))}</ul>
            </details>
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>Related Products</h2>
        <div className="rowDesign">
          {relatedProducts.map((product, index) => (
            <ProductCard key={index} product={product} onCardClick={handleCardClick} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
