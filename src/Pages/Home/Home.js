import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Shared/Loader";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { product } from "../../Store/GenericStore";
import ProductCard from "../../Components/ProductCard/ProductCard";
import FilterBar from "../../Components/FiilterBar/FilterBar";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productData = useSelector((state) => state?.products?.list || []);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false); // State for modal visibility
  const [filteredProducts, setFilteredProducts] = useState([]);
  

  useEffect(() => {
    // Load posts when the component mounts
    if (productData.length === 0) {
      dispatch(product("api/Products")).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      setFilteredProducts(productData);
    }
  }, [dispatch, productData]);

  const handleCardClick = (product) => {
    navigate(`/product/${product.productId}`);
  };

  // Handle the back navigation
  useEffect(() => {
    const handlePopState = () => {
      setShowDetailModal(false); // Hide the modal when navigating back
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  
  const handleCategorySelect = (category) => {
    // Filter products based on the selected category
    if (category === "all") {
      setFilteredProducts(productData); // Show all products if "all" is selected
    } else {
      const filtered = productData.filter((product) =>
        product.categoryId === category
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    // <div>
    //   {loading ? (
    //     <div className="center-loader">
    //       <Loader />
    //     </div>
    //   ) : showDetailModal === false ? (
    //     <div className="rowDesign">
    //       {productData.map((product, index) => (
    //         <ProductCard
    //           key={index}
    //           product={product}
    //           onCardClick={handleCardClick}
    //         />
    //       ))}
    //     </div>
    //   ) : null}
    // </div>
    <div>
      <div className="product-form">
      <FilterBar onCategorySelect={handleCategorySelect} />
      </div>
      <div className="product-form">
      {loading ? (
        <div className="center-loader">
          <Loader />
        </div>
      ) : (
        <div className="rowDesign">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
