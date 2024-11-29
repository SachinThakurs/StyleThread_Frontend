// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId && cartItem.colorId === item.colorId
      );

      if (existingItemIndex !== -1) {
        // Update the existing item if it's already in the cart
        const updatedCartItems = [...state.cartItems];
        const updatedItem = updatedCartItems[existingItemIndex];
        if (updatedItem.quantity < 5) {
          updatedItem.quantity += 1; // Only allow up to 5 items of the same color
        }
        state.cartItems = updatedCartItems;
      } else {
        // Add the new item to the cart
        state.cartItems.push({ ...item, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.productId !== itemId);
    },

    updateCartItemQuantity: (state, action) => {
      const { productId, colorId, quantity } = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item.productId === productId && item.colorId === colorId
      );

      if (itemIndex !== -1) {
        state.cartItems[itemIndex].quantity = quantity;
      }
    },
  },
});

// Export cart slice actions and reducer
export const { addToCart, removeFromCart, updateCartItemQuantity } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
