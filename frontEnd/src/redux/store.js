import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import theaterReducer from "./slices/theaterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theater: theaterReducer,
  },
});
