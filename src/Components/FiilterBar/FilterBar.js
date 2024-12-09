import React from "react";
import { useDispatch } from "react-redux";
import "./FilterBar.css";

const FilterBar = ({ onCategorySelect }) => {
  const categories = [
    { label: "Men", value: 1 },
    { label: "Women", value: 2 },
    { label: "Baby & Kids", value: 3 },
    { label: "Sports", value: 15 }
  ];

  const handleCategoryClick = (category) => {
    onCategorySelect(category); // Notify the parent component about category selection
  };

  return (
    <div className="filter-bar">
      <ul className="filter-options">
        {categories.map((category) => (
          <li
            key={category.value}
            className="filter-item"
            onClick={() => handleCategoryClick(category.value)}
          >
            {category.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterBar;
