import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import deviceReducer from "./reducers/deviceReducer";
import borrowingReducer from "./reducers/borrowingReducer";
import postReducer from "./reducers/postReducer";
import userReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: deviceReducer,
    borrowings: borrowingReducer,
    posts: postReducer,
    users: userReducer,
  },
});

export default store;

