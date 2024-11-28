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
