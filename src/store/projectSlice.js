import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

export const fetchProjects = createAsyncThunk("projects/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/projects");
    return res.data.data.projects;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
  }
});

export const createProject = createAsyncThunk("projects/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/projects", payload);
    return res.data.data.project;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Create project failed");
  }
});

export const fetchProjectById = createAsyncThunk("projects/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/projects/${id}`);
    return res.data.data.project;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch project");
  }
});

const slice = createSlice({
  name: "projects",
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchProjects.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(createProject.fulfilled, (s, a) => {
        s.list.unshift(a.payload);
      })

      .addCase(fetchProjectById.fulfilled, (s, a) => {
        s.current = a.payload;
      });
  }
});

export default slice.reducer;
