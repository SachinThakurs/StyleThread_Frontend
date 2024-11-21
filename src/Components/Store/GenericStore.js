import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./Middleware/api";

const createEntitySlice = (entityName) => {
  const slice = createSlice({
    name: entityName,
    initialState: {
      list: [],
      loading: false,
    },
    reducers: {
      entityRequested: (state) => {
        state.loading = true;
      },
      entityReceived: (state, action) => {
        state.list = action.payload;
        state.loading = false;
      },
      entityRequestFailed: (state) => {
        state.loading = false;
      },
    },
  });

  const { entityRequested, entityReceived, entityRequestFailed } =
    slice.actions;

  const loadEntity = (url) => (dispatch) => {
    return dispatch(
      apiCallBegan({
        url,
        onStart: entityRequested.type,
        onSuccess: entityReceived.type,
        onError: entityRequestFailed.type,
      })
    );
  };

  return { reducer: slice.reducer, actions: { loadEntity } };
};

// Export slices for different entities
export const productSlice = createEntitySlice("product");
export const addProductsSlice = createEntitySlice("addProducts");

// Export the reducers and actions

export const {
  reducer: productReducer,
  actions: { loadEntity: product },
} = productSlice;

export const {
  reducer: addProductsReducer,
  actions: { loadEntity: addProducts },
} = addProductsSlice;

// Export all reducers as default
export default {
  productReducer,
  addProductsReducer,
};
