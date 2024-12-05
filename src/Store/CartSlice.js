import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId && cartItem.colorId === item.colorId
      );

      if (existingItemIndex !== -1) {
        const updatedItem = state.cartItems[existingItemIndex];
        if (updatedItem.quantity < 5) {
          updatedItem.quantity += 1; // Limit quantity to 5
        }
      } else {
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

export const { addToCart, removeFromCart, updateCartItemQuantity } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
