import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import projectReducer from "./projectSlice";
import taskReducer from "./taskSlice";
import notificationReducer from "./notificationSlice";
import socketReducer from "./socketSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
    socket: socketReducer,
    ui: uiReducer
  }
});