import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const apiCallBegan = createAction("api/callBegan");
export const apiCallSuccess = createAction("api/callSuccess");
export const apiCallFailed = createAction("api/callFailed");

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== apiCallBegan.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    try {
      const response = await axios.request({
        baseURL: "https://localhost:44314/",
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request headers
        },
      });

      dispatch(apiCallSuccess(response.data));
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      dispatch(apiCallFailed(error.message));
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };

export default api;



// import { createAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// export const apiCallBegan = createAction("api/callBegan");
// export const apiCallSuccess = createAction("api/callSuccess");
// export const apiCallFailed = createAction("api/callFailed");

// const api =
//   ({ dispatch }) =>
//   (next) =>
//   async (action) => {
//     if (action.type !== apiCallBegan.type) return next(action);

//     const { url, method, data, onStart, onSuccess, onError } = action.payload;

//     if (onStart) dispatch({ type: onStart });

//     next(action);

//     // Retrieve token from localStorage
//     const token = localStorage.getItem("token");

//     // Check if token is expired
//     const isTokenExpired = () => {
//       if (!token) return true;
//       try {
//         const { exp } = jwtDecode(token); // Decode the token and get expiration time
//         const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
//         return exp < currentTime; // Token is expired if current time is past expiration
//       } catch (error) {
//         console.error("Invalid token:", error);
//         return true; // Treat invalid tokens as expired
//       }
//     };

//     if (isTokenExpired()) {
//       // Handle expired token
//       localStorage.removeItem("token");
//       dispatch(apiCallFailed("Token expired. Please log in again."));
//       // Optionally navigate to login page or dispatch a logout action
//       return;
//     }

//     try {
//       const response = await axios.request({
//         baseURL: "https://localhost:44314/",
//         url,
//         method,
//         data,
//         headers: {
//           Authorization: `Bearer ${token}`, // Include token in request headers
//         },
//       });

//       dispatch(apiCallSuccess(response.data));
//       if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
//     } catch (error) {
//       if (error.response?.status === 401) {
//         // Unauthorized - handle token expiration or invalid token
//         localStorage.removeItem("token");
//         dispatch(apiCallFailed("Unauthorized. Token may be expired."));
//         // Optionally navigate to login page or dispatch a logout action
//       } else {
//         dispatch(apiCallFailed(error.message));
//         if (onError) dispatch({ type: onError, payload: error.message });
//       }
//     }
//   };

// export default api;
