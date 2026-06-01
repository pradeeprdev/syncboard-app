import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/projects");
      return res.data.data.projects;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/projects", payload);
      return res.data.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/projects/${projectId}`, payload);
      return res.data.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

export const archiveProject = createAsyncThunk(
  "projects/archiveProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/projects/${projectId}`);
      return res.data.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to archive project"
      );
    }
  }
);

export const inviteMember = createAsyncThunk(
  "projects/inviteMember",
  async ({ projectId, email, role }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/projects/${projectId}/invitations`, {
        email,
        role,
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to invite member"
      );
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  "projects/acceptInvitation",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.post(`/projects/invitations/${token}/accept`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to accept invitation"
      );
    }
  }
);

export const fetchActivity = createAsyncThunk(
  "projects/fetchActivity",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/projects/${projectId}/activity`);
      return res.data.data.activity;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activity"
      );
    }
  }
);

export const fetchInvitations = createAsyncThunk(
  "projects/fetchInvitations",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/projects/${projectId}/invitations`);
      return res.data.data.invitations;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch invitations"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    list: [],
    current: null,
    currentRole: null,
    activity: [],
    invitations: [],
    loading: false,
    error: null,
    inviteResult: null,
  },
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearInviteResult: (state) => {
      state.inviteResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.project;
        state.currentRole = action.payload.role;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })

      .addCase(archiveProject.fulfilled, (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })

      .addCase(inviteMember.fulfilled, (state, action) => {
        state.inviteResult = action.payload;
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.activity = action.payload;
      });
  },
});

export const { clearProjectError, clearInviteResult } =
  projectSlice.actions;

export default projectSlice.reducer;