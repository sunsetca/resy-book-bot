import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import venueReducer from "./venueSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    venue: venueReducer
  }
})
export default store