import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { Button } from "../Atoms/Button";

function ProductVariant({ variantData, updateVariant }) {
  const dropdowns = useSelector((state) => state.addProducts?.list || {});
  const [localVariant, setLocalVariant] = useState({
    Price: "",
    SalePrice: "",
    Inventory: "",
    Discount: "",
    ColorId: "",
    Sizes: [],
    SizeIds: [],
    Image: [],
    ...variantData,
  });

  useEffect(
    () => setLocalVariant((prev) => ({ ...prev, ...variantData })),
    [variantData]
  );

  const handleChange = ({ target: { name, value } }) => {
    const updatedVariant = { ...localVariant, [name]: value };
    setLocalVariant(updatedVariant);
    updateVariant(updatedVariant);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(file);
        });
      })
    ).then((updatedImages) => {
      const updatedVariant = {
        ...localVariant,
        Image: [...localVariant.Image, ...updatedImages],
      };
      setLocalVariant(updatedVariant);
      updateVariant(updatedVariant);
    });
  };
  
  const handleRemoveImage = (index, e) => {
    // Prevent form submission or other events from being triggered
    e.preventDefault();
    e.stopPropagation();

    const updatedImages = localVariant.Image.filter((_, i) => i !== index);
    setLocalVariant((prev) => ({ ...prev, Image: updatedImages }));
    updateVariant({ ...localVariant, Image: updatedImages });
  };

  const handleSelectChange = (selectedSizes) => {
    const updatedVariant = {
      ...localVariant,
      SizeIds: selectedSizes.map((size) => size.value),
      Sizes: selectedSizes,
    };
    setLocalVariant(updatedVariant);
    updateVariant(updatedVariant);
  };

  const renderSelect = (label, name, options, optionId, optionName) => (
    <div className="inputContainer">
      <label className="inputLabel">{label}:</label>
      <select
        className="customDrodown"
        name={name}
        value={localVariant[name] || ""}
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
    <>
      {["Price", "SalePrice", "Inventory"].map((field) => (
        <div key={field} className="inputContainer">
          <label className="inputLabel">{field}:</label>
          <input
            className="customInput"
            placeholder={`Enter ${field}`}
            type="number"
            name={field}
            value={localVariant[field] || ""}
            onChange={handleChange}
            required
          />
          <div className="inputUnderline"></div>
        </div>
      ))}
      {renderSelect(
        "Color",
        "ColorId",
        dropdowns.color || [],
        "colorId",
        "colorName"
      )}
      <div className="inputContainer">
        <label className="inputLabel">Size:</label>
        <Select
          className="customDrodown"
          isMulti
          value={dropdowns.sizes
            ?.filter((size) => localVariant.SizeIds.includes(size.sizeId))
            .map((size) => ({
              value: size.sizeId,
              label: size.sizeName,
            }))}
          options={dropdowns.sizes?.map((size) => ({
            value: size.sizeId,
            label: size.sizeName,
          }))}
          onChange={handleSelectChange}
          styles={{
            control: (provided) => ({ ...provided, minHeight: "40px" }),
            menu: (provided) => ({
              ...provided,
              maxHeight: "150px",
              overflowY: "auto",
            }),
          }}
        />
        <div className="inputUnderline"></div>
      </div>
      <div className="inputContainer">
        <label className="inputLabel">Image:</label>
        <input
          className="customInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required={!localVariant.Image.length}
        />
        <div className="inputUnderline"></div>
      </div>
      {localVariant.Image.length > 0 && (
        <div className="image-preview">
          {localVariant.Image.map((imgSrc, index) => {
            // Only render valid base64 images
            if (!imgSrc) return null; // Skip invalid or empty images
            const imageUrl = imgSrc.startsWith("http")
              ? imgSrc
              : `data:image/jpeg;base64,${imgSrc}`;
            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  display: "inline-block",
                  margin: "10px",
                }}
              >
                <img
                  src={imageUrl}
                  alt={`Preview ${index + 1}`}
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
                  <Button className="close-button" label="&times;" onClick={(e) => handleRemoveImage(index, e)}/>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default ProductVariant;
