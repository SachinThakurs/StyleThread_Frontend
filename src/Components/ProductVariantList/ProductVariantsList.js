import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ProductVariant from '../ProductVariant/ProductVariant';
import './ProductVariantsList.css'; // Import appropriate CSS file for styling

export const ProductVariantsList = ({
  productVariants,
  selectedVariantIndex,
  setSelectedVariantIndex,
  addVariant,
  deleteVariant,
  updateVariant
}) => {
  const maxVariants = 5; // Maximum allowed variants

  return (
    <div className="variants-container">
      {/* Variant Count Display */}
      <div className="variant-count-display">
        Total Variants: {productVariants.length} / {maxVariants}
      </div>

      {/* Variant Selection */}
      <div className="variant-selection">
        {productVariants.map((_, index) => (
          <div
            className={`variant-header ${selectedVariantIndex === index ? 'selected' : ''}`}
            onClick={() => setSelectedVariantIndex(index)}
            key={index}
          >
            <h5>{index + 1}</h5>
          </div>
        ))}

        {/* Add Variant Button (Hidden if 5 variants are already added) */}
        {productVariants.length < maxVariants && (
          <div className="variant-header">
            <FaPlus className="icon" onClick={addVariant} />
          </div>
        )}
      </div>

      {/* Variant Details */}
      <div className="add-product-variant">
        <div className="header-container">
          <h3>Product Variants</h3>

          {/* Delete Variant Button (Only if more than 1 variant exists) */}
          {productVariants.length > 1 && (
            <div className="deleteButton">
              <FaTrash
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteVariant(selectedVariantIndex);
                }}
              />
            </div>
          )}
        </div>

        {/* Product Variant Details */}
        <div className="row product-variants-container">
          <ProductVariant
            variantData={productVariants[selectedVariantIndex]}
            updateVariant={(updatedVariant) => updateVariant(selectedVariantIndex, updatedVariant)}
          />
        </div>
      </div>
    </div>
  );
};