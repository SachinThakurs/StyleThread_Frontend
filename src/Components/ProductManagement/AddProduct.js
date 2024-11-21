import React, { useEffect, useState } from "react";
import "./AddProduct.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import ProductVariant from "./ProductVariant";
import { useDispatch, useSelector } from "react-redux";
import { addProducts } from "../Store/GenericStore";
import { useLocation } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { product: initialProduct } = location.state || {};

  // Initialize product state
  const [product, setProduct] = useState({
    ProductId: initialProduct?.productId || 0,
    SKU: initialProduct?.sku || "",
    Name: initialProduct?.name || "",
    Description: initialProduct?.description || "",
    CategoryId: initialProduct?.categoryId || 0,
    BrandId: initialProduct?.brandId || 0,
    ListedOn: new Date().toISOString().slice(0, 10),
    FitId: initialProduct?.fitId || 0,
    FabricId: initialProduct?.fabricId || 0,
    SleeveId: initialProduct?.sleeveId || 0,
    Reversible: initialProduct?.reversible || false,
    NeckTypeId: initialProduct?.neckTypeId || 0,
    FabricCareId: initialProduct?.fabricCareId || 0,
    ProductVariants: initialProduct?.productVariants?.length
      ? initialProduct.productVariants
      : [
          {
            ProductVariantId: 0,
            ProductId: 0,
            SizeIds: [],
            ColorId: 0,
            Price: "",
            SalePrice: "",
            Discount: "",
            Inventory: "",
            Image: [""],
            Sizes: [],
          },
        ],
  });

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const dropdowns = useSelector((state) => state.addProducts?.list || {});

  useEffect(() => {
    dispatch(addProducts("api/Products/GetAllAddProduct"));
  }, [dispatch]);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      ProductVariants: [
        ...prev.ProductVariants,
        {
          ProductVariantId: 0,
          ProductId: 0,
          SizeIds: [],
          ColorId: 0,
          Price: "",
          SalePrice: "",
          Discount: "",
          Inventory: "",
          Image: [""],
          Sizes: [],
        },
      ],
    }));
    setSelectedVariantIndex(product.ProductVariants.length);
  };

  const deleteVariant = (index) => {
    if (product.ProductVariants.length > 1) {
      setProduct((prev) => ({
        ...prev,
        ProductVariants: prev.ProductVariants.filter((_, i) => i !== index),
      }));
      setSelectedVariantIndex(index - 1);
    }
  };

  // Update handler to pass to ProductVariant
  const updateVariant = (index, updatedVariant) => {
    const updatedVariants = [...product.ProductVariants];
    updatedVariants[index] = updatedVariant;
    setProduct((prev) => ({
      ...prev,
      ProductVariants: updatedVariants,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Transform ProductVariants before sending
    const transformedProductVariants = product.ProductVariants.map((variant) => ({
      productVariantId: variant.ProductVariantId,
      productId: variant.ProductId,
      colorId: parseInt(variant.ColorId, 10),
      price: parseFloat(variant.Price),
      salePrice: parseFloat(variant.SalePrice),
      discount: variant.Discount ? parseFloat(variant.Discount) : 0,
      inventory: parseInt(variant.Inventory, 10),
      image: variant.Image.filter(img => img), // Ensure no empty strings
      productVariantSizes: variant.SizeIds.map((sizeId) => ({
        productVariantId: variant.ProductVariantId,
        sizeId: sizeId,
      })),
    }));
  
    const finalProductData = {
      productId: product.ProductId,
      sku: product.SKU,
      name: product.Name,
      description: product.Description,
      categoryId: parseInt(product.CategoryId, 10),
      brandId: parseInt(product.BrandId, 10),
      listedOn: product.ListedOn,
      listedBy: "YourUserName", // Replace with actual user if available
      fitId: parseInt(product.FitId, 10),
      fabricId: parseInt(product.FabricId, 10),
      sleeveId: parseInt(product.SleeveId, 10),
      reversible: product.Reversible,
      neckTypeId: parseInt(product.NeckTypeId, 10),
      fabricCareId: parseInt(product.FabricCareId, 10),
      productVariants: transformedProductVariants,
    };
  
    console.log("Final Product Data:", finalProductData);
  
    try {
      const response = await axios.post("https://localhost:44314/api/Products", finalProductData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Success:", response.data);
      // Handle success (e.g., navigate to another page, show a success message, etc.)
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message)
    }
  };
  
  
  const renderInput = (
    label,
    name,
    type = "text",
    required = false,
    placeholder
  ) => (
    <div className="inputContainer">
      <label className="inputLabel">{label}:</label>
      <input
        className="customInput"
        placeholder={placeholder}
        type={type}
        name={name}
        value={product[name]}
        onChange={handleChange}
        required={required}
      />
      <div className="inputUnderline"></div>
    </div>
  );

  const renderSelect = (label, name, options, optionId, optionName) => (
    <div className="inputContainer">
      <label className="inputLabel">{label}:</label>
      <select
        className="customInput"
        name={name}
        value={product[name]}
        onChange={handleChange}
        required
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option[optionId]} value={option[optionId]}>
            {option[optionName]}
          </option>
        ))}
      </select>
      <div className="inputUnderline"></div>
    </div>
  );

  return (
    <div className="add-form">
      <div className="add-product-containers mt-4">
        <h2>{initialProduct ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="product-forms">
          <div className="row">
            <div className="col-6">
              <div className="add-product-variant">
                {renderInput("SKU", "SKU", "text", true, "Enter SKU")}
                {renderInput("Name", "Name", "text", true, "Enter Name")}
                <div className="inputContainer">
                  <label className="inputLabel">Description:</label>
                  <textarea
                    className="customInput description"
                    placeholder="Enter Product Description"
                    name="Description"
                    value={product.Description}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="inputUnderline"></div>
                </div>
                {renderSelect(
                  "Category",
                  "CategoryId",
                  dropdowns.categories || [],
                  "categoryId",
                  "name"
                )}
                {renderSelect(
                  "Brand",
                  "BrandId",
                  dropdowns.brands || [],
                  "brandId",
                  "name"
                )}
                {renderSelect(
                  "Fit",
                  "FitId",
                  dropdowns.fits || [],
                  "fitId",
                  "fitName"
                )}
                {renderSelect(
                  "Fabric",
                  "FabricId",
                  dropdowns.fabrics || [],
                  "fabricId",
                  "fabricName"
                )}
                {renderSelect(
                  "Sleeve",
                  "SleeveId",
                  dropdowns.sleeves || [],
                  "sleeveId",
                  "sleeveType"
                )}
                {renderSelect(
                  "Neck Type",
                  "NeckTypeId",
                  dropdowns.neckTypes || [],
                  "neckTypeId",
                  "neckTypeName"
                )}
                {renderSelect(
                  "Fabric Care",
                  "FabricCareId",
                  dropdowns.fabricCares || [],
                  "fabricCareId",
                  "careInstructions"
                )}
                <div className="inputContainer">
                  <label className="inputLabel">Reversible:</label>
                  <input
                    className="customInput"
                    type="checkbox"
                    name="Reversible"
                    checked={product.Reversible}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="variants-and-count">
                {product.ProductVariants.map((_, index) => (
                  <div
                    className={`variant-header ${
                      selectedVariantIndex === index ? "selected" : ""
                    }`}
                    onClick={() => setSelectedVariantIndex(index)}
                    key={index}
                  >
                    <h5>{index + 1}</h5>
                  </div>
                ))}
                <div className="variant-header">
                  <FaPlus className="icon" onClick={addVariant} />
                </div>
              </div>
              <div className="add-product-variant">
                <div className="header-container">
                  <h3>Product Variants</h3>
                  {product.ProductVariants.length > 1 && (
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
                <div className="row product-variants-container">
                  {/* {product.ProductVariants.map((variant, index) => ( 
                   <ProductVariant
                      key={index}
                      variant={variant}
                      index={index}
                      selectedVariantIndex={selectedVariantIndex}
                      deleteVariant={deleteVariant}
                      setSelectedVariantIndex={setSelectedVariantIndex}
                      colors={dropdowns.color || []}
                      sizes={dropdowns.sizes || []}
                    /> */}
                     <ProductVariant
                      variantData={
                        product.ProductVariants[selectedVariantIndex]
                     }
                     updateVariant={(updatedVariant) =>
                        updateVariant(selectedVariantIndex, updatedVariant)
                      }
                     />  
                 {/* ))} */}
                </div>
              </div>
            </div>
          </div>
          <div className="submitContainer">
            <button className="submitButton" type="submit">
              {initialProduct ? "Update" : "Add"} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
