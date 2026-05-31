import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", formData);

      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);

      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Register failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);

      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      return res.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unauthorized");
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    loading: false,
    error: null
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;