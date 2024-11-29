import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { addProducts } from "../../Store/GenericStore";
import { FormGroup } from "../../Components/Atoms/FormGroup";
import { ProductVariantsList } from "../../Components/ProductVariantList/ProductVariantsList";
import "./AddProduct.css";
import { Checkbox } from "../../Components/Atoms/Checkbox";
import { Input } from "../../Components/Atoms/Input"; // Correct import statement
import { Button } from "../../Components/Atoms/Button";
import { showToast } from "../../Utils/Helper/ToastNotifications";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function AddProduct() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); // For redirection

  const { product: initialProduct } = location.state || {};

  const [product, setProduct] = useState({
    ProductId: initialProduct?.productId || 0,
    SKU: initialProduct?.sku || "",
    Name: initialProduct?.name || "",
    Description: initialProduct?.description || "",
    CategoryId: initialProduct?.categoryId || 0,
    BrandId: initialProduct?.brandId || 0,
    ListedOn: initialProduct?.listedOn || new Date().toISOString().slice(0, 10),
    FitId: initialProduct?.fitId || 0,
    FabricId: initialProduct?.fabricId || 0,
    SleeveId: initialProduct?.sleeveId || 0,
    Reversible: initialProduct?.reversible || false,
    NeckTypeId: initialProduct?.neckTypeId || 0,
    FabricCareId: initialProduct?.fabricCareId || 0,
    ProductVariants: initialProduct?.productVariants?.length
      ? initialProduct.productVariants.map((variant) => ({
          ProductVariantId: variant.productVariantId || 0,
          ProductId: variant.productId || 0,
          SizeIds:
            variant.productVariantSizes?.map((size) => size.sizeId) || [],
          ColorId: variant.colorId || 0,
          Price: variant.price || "",
          SalePrice: variant.salePrice || "",
          Discount: variant.discount || "",
          Inventory: variant.inventory || "",
          Image: variant.image || [""],
          Sizes: variant.productVariantSizes || [],
        }))
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
  const [loading, setLoading] = useState(false); // Loading state for the loader

  useEffect(() => {
    dispatch(addProducts("api/Products/GetAllAddProduct"));
  }, [dispatch]);

  useEffect(() => {
    showToast("success", "Test success message");
  }, []);

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

  const updateVariant = (index, updatedVariant) => {
    const updatedVariants = [...product.ProductVariants];
    updatedVariants[index] = updatedVariant;
    setProduct((prev) => ({ ...prev, ProductVariants: updatedVariants }));
  };

  const handleSubmit = async (e) => {
    setLoading(true); // Show loader when submitting
    e.preventDefault();

    const transformedProductVariants = product.ProductVariants.map(
      (variant) => ({
        productVariantId: variant.ProductVariantId,
        productId: variant.ProductId,
        colorId: parseInt(variant.ColorId, 10),
        price: parseFloat(variant.Price),
        salePrice: parseFloat(variant.SalePrice),
        discount: variant.Discount ? parseFloat(variant.Discount) : 0,
        inventory: parseInt(variant.Inventory, 10),
        image: variant.Image.filter((img) => img),
        productVariantSizes: variant.SizeIds.map((sizeId) => ({
          productVariantId: variant.ProductVariantId,
          sizeId,
        })),
      })
    );

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

    try {
      const url = initialProduct
        ? `https://localhost:44314/api/Products/${product.ProductId}` // PUT request for update
        : `https://localhost:44314/api/Products`; // POST request for add

      const method = initialProduct ? "PUT" : "POST"; // If it's an update, use PUT, else use POST

      const response = await axios({
        method,
        url,
        data: finalProductData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.error) {
        showToast("error", response.data.error);
      } else {
        initialProduct ? showToast("success", "Product updated successfully!") : 
        showToast("success", "Product saved successfully!");
        // setTimeout(10000)
        // navigate("/productList");
      }
    } catch (error) {
      console.error("Error during API submission: ", error);
  
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data?.message || "Server error occurred."
          : error.message || "An error occurred.";
  
      showToast("error", errorMessage);
    } finally {
      setLoading(false); // Hide loader after submission
    }
  };

  return (
    <div className="add-form">
      <ToastContainer />
      <div className="add-product-containers mt-4">
        <h2>{initialProduct ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="product-forms">
          <div className="row">
            <div className="col-6">
              <Input
                label="SKU"
                placeholder="Enter SKU"
                name="SKU"
                value={product.SKU}
                onChange={handleChange}
                required
              />
              <Input
                label="Name"
                placeholder="Enter Name"
                name="Name"
                value={product.Name}
                onChange={handleChange}
                required
              />
              <FormGroup
                label="Description"
                placeholder="Enter Description"
                name="Description"
                value={product.Description}
                onChange={handleChange}
                type="textarea"
                required
              />
              <FormGroup
                label="Category"
                placeholder="Select Category"
                name="CategoryId"
                value={product.CategoryId}
                onChange={handleChange}
                options={dropdowns.categories || []}
                optionId="categoryId"
                optionName="name"
                type="select"
              />
              <FormGroup
                label="Brand"
                name="BrandId"
                value={product.BrandId}
                onChange={handleChange}
                options={dropdowns.brands || []}
                optionId="brandId"
                optionName="name"
                type="select"
              />
              <FormGroup
                label="Fit"
                name="FitId"
                value={product.FitId}
                onChange={handleChange}
                options={dropdowns.fits || []}
                optionId="fitId"
                optionName="fitName"
                type="select"
              />
              <FormGroup
                label="Fabric"
                name="FabricId"
                value={product.FabricId}
                onChange={handleChange}
                options={dropdowns.fabrics || []}
                optionId="fabricId"
                optionName="fabricName"
                type="select"
              />
              <FormGroup
                label="Sleeve"
                name="SleeveId"
                value={product.SleeveId}
                onChange={handleChange}
                options={dropdowns.sleeves || []}
                optionId="sleeveId"
                optionName="sleeveType"
                type="select"
              />
              <FormGroup
                label="Neck Type"
                name="NeckTypeId"
                value={product.NeckTypeId}
                onChange={handleChange}
                options={dropdowns.neckTypes || []}
                optionId="neckTypeId"
                optionName="neckTypeName"
                type="select"
              />
              <FormGroup
                label="Fabric Care"
                name="FabricCareId"
                value={product.FabricCareId}
                onChange={handleChange}
                options={dropdowns.fabricCares || []}
                optionId="fabricCareId"
                optionName="careInstructions"
                type="select"
              />
              <Checkbox
                label="Reversible"
                name="Reversible"
                checked={product.Reversible}
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <ProductVariantsList
                productVariants={product.ProductVariants}
                selectedVariantIndex={selectedVariantIndex}
                setSelectedVariantIndex={setSelectedVariantIndex}
                addVariant={addVariant}
                deleteVariant={deleteVariant}
                updateVariant={updateVariant}
              />
            </div>
          </div>
          <div className="submitContainer">
            <Button label={initialProduct ? "Update" : "Add"} />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
