import { configureStore } from "@reduxjs/toolkit";
import { 
  addProductsReducer,
  productReducer
} from "./GenericStore"; // Import all entity reducers
import api from "./Middleware/api"; // Your API middleware
import { cartReducer } from "./CartSlice";

export default function store() {
  return configureStore({
    reducer: {
      addProducts : addProductsReducer,
      products: productReducer,
      cart: cartReducer, // Add the cart reducer here
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api),
  });
}
