import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

export const fetchTasks = createAsyncThunk("tasks/fetch", async ({ projectId, params = {} }, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/projects/${projectId}/tasks?${query}`);
    return res.data.data.tasks;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
  }
});

export const createTask = createAsyncThunk("tasks/create", async ({ projectId, payload }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/projects/${projectId}/tasks`, payload);
    return res.data.data.task;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Create task failed");
  }
});

export const bulkUpdateStatus = createAsyncThunk("tasks/bulkStatus", async ({ projectId, taskIds, status }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/projects/${projectId}/tasks/bulk/status`, { taskIds, status });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Bulk update failed");
  }
});

export const bulkAssign = createAsyncThunk("tasks/bulkAssign", async ({ projectId, taskIds, assigneeId }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/projects/${projectId}/tasks/bulk/assign`, { taskIds, assigneeId });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Bulk assign failed");
  }
});

export const bulkDelete = createAsyncThunk("tasks/bulkDelete", async ({ projectId, taskIds }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/projects/${projectId}/tasks/bulk/delete`, { taskIds });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Bulk delete failed");
  }
});

export const uploadAttachment = createAsyncThunk("tasks/uploadAttachment", async ({ projectId, taskId, file }, { rejectWithValue }) => {
  try {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post(`/projects/${projectId}/tasks/${taskId}/attachments`, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.data.attachment;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Upload failed");
  }
});

const slice = createSlice({
  name: "tasks",
  initialState: { list: [], loading: false, error: null },
  reducers: {
    addTaskOptimistic: (s, a) => s.list.unshift(a.payload),
    replaceTask: (s, a) => {
      const idx = s.list.findIndex((t) => t._id === a.payload._id);
      if (idx >= 0) s.list[idx] = a.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchTasks.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchTasks.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(createTask.fulfilled, (s, a) => {
        s.list.unshift(a.payload);
      });
  }
});

export const { addTaskOptimistic, replaceTask } = slice.actions;

export default slice.reducer;
