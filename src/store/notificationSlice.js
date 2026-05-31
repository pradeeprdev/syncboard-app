import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/projects/${projectId}/notifications`);
      return res.data.data.notifications;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async ({ projectId, notificationId }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/projects/${projectId}/notifications/${notificationId}/read`);
      return res.data.data.notification;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark read");
    }
  }
);

const slice = createSlice({
  name: "notifications",
  initialState: { list: [], loading: false, error: null },
  reducers: {
    pushNotification: (s, a) => s.list.unshift(a.payload),
    clearNotifications: (s) => {
      s.list = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchNotifications.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(markNotificationRead.fulfilled, (s, a) => {
        const idx = s.list.findIndex((n) => n._id === a.payload._id);
        if (idx >= 0) s.list[idx] = a.payload;
      });
  }
});

export const { pushNotification, clearNotifications } = slice.actions;

export default slice.reducer;
