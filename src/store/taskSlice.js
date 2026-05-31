import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../lib/api";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ projectId, query = "" }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks${query}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/projects/${projectId}/tasks`, payload);
      return res.data.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ projectId, taskId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/projects/${projectId}/tasks/${taskId}`,
        payload
      );
      return res.data.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

export const bulkUpdateStatus = createAsyncThunk(
  "tasks/bulkUpdateStatus",
  async ({ projectId, taskIds, status }, { rejectWithValue }) => {
    try {
      await api.patch(`/projects/${projectId}/tasks/bulk/status`, {
        taskIds,
        status,
      });

      return { taskIds, status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update tasks"
      );
    }
  }
);

export const bulkAssignTasks = createAsyncThunk(
  "tasks/bulkAssignTasks",
  async ({ projectId, taskIds, assigneeIds }, { rejectWithValue }) => {
    try {
      await api.patch(`/projects/${projectId}/tasks/bulk/assign`, {
        taskIds,
        assigneeIds,
      });

      return { taskIds, assigneeIds };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign tasks"
      );
    }
  }
);

export const bulkDeleteTasks = createAsyncThunk(
  "tasks/bulkDeleteTasks",
  async ({ projectId, taskIds }, { rejectWithValue }) => {
    try {
      await api.patch(`/projects/${projectId}/tasks/bulk/delete`, {
        taskIds,
      });

      return taskIds;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete tasks"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    pagination: null,
    loading: false,
    error: null,
    selectedIds: [],
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },

    toggleTaskSelection: (state, action) => {
      const id = action.payload;

      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
      } else {
        state.selectedIds.push(id);
      }
    },

    clearTaskSelection: (state) => {
      state.selectedIds = [];
    },

    selectAllTasks: (state) => {
      state.selectedIds = state.list.map((task) => task._id);
    },

    addTaskFromSocket: (state, action) => {
      const task = action.payload;
      const exists = state.list.some((t) => t._id === task._id);

      if (!exists) {
        state.list.unshift(task);
      }
    },

    updateTaskFromSocket: (state, action) => {
      const task = action.payload;

      state.list = state.list.map((item) =>
        item._id === task._id ? task : item
      );
    },

    deleteTaskFromSocket: (state, action) => {
      const taskId = action.payload;

      state.list = state.list.filter((task) => task._id !== taskId);
      state.selectedIds = state.selectedIds.filter((id) => id !== taskId);
    },

    bulkUpdateFromSocket: (state, action) => {
      const { taskIds, status, assigneeIds } = action.payload;

      state.list = state.list.map((task) => {
        if (!taskIds.includes(task._id)) return task;

        return {
          ...task,
          ...(status ? { status } : {}),
          ...(assigneeIds
            ? {
                assignees: [
                  ...(task.assignees || []),
                  ...assigneeIds,
                ],
              }
            : {}),
        };
      });
    },

    bulkDeleteFromSocket: (state, action) => {
      const taskIds = action.payload;

      state.list = state.list.filter(
        (task) => !taskIds.includes(task._id)
      );

      state.selectedIds = state.selectedIds.filter(
        (id) => !taskIds.includes(id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        const exists = state.list.some(
          (task) => task._id === action.payload._id
        );

        if (!exists) {
          state.list.unshift(action.payload);
        }
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        state.list = state.list.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (task) => task._id !== action.payload
        );
      })

      .addCase(bulkUpdateStatus.fulfilled, (state, action) => {
        const { taskIds, status } = action.payload;

        state.list = state.list.map((task) =>
          taskIds.includes(task._id)
            ? { ...task, status }
            : task
        );

        state.selectedIds = [];
      })

      .addCase(bulkAssignTasks.fulfilled, (state) => {
        state.selectedIds = [];
      })

      .addCase(bulkDeleteTasks.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (task) => !action.payload.includes(task._id)
        );

        state.selectedIds = [];
      });
  },
});

export const {
  clearTaskError,
  toggleTaskSelection,
  clearTaskSelection,
  selectAllTasks,
  addTaskFromSocket,
  updateTaskFromSocket,
  deleteTaskFromSocket,
  bulkUpdateFromSocket,
  bulkDeleteFromSocket,
} = taskSlice.actions;

export default taskSlice.reducer;