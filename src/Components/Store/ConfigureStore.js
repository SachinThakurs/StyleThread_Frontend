
// // store.js
// import { configureStore } from "@reduxjs/toolkit";
// import productReducer from "./ProductSlice"; // Your existing product slice
// import categoriesReducer from "./CategorySlice"; // Categories slice
// import brandsReducer from "./BrandSlice"; // Brands slice
// import api from "./Middleware/api"; // Your API middleware

// export default function store() {
//   return configureStore({
//     reducer: {
//       products: productReducer,
//       categories: categoriesReducer,
//       brands: brandsReducer,
//     },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api),
//   });
// }


import { configureStore } from "@reduxjs/toolkit";
import { 
  addProductsReducer,
  productReducer
} from "./GenericStore"; // Import all entity reducers
import api from "./Middleware/api"; // Your API middleware

export default function store() {
  return configureStore({
    reducer: {
      addProducts : addProductsReducer,
      products: productReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api),
  });
}
