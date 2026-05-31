import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "ui",
  initialState: { taskModalOpen: false, inviteModalOpen: false, toast: null },
  reducers: {
    openTaskModal: (s) => { s.taskModalOpen = true; },
    closeTaskModal: (s) => { s.taskModalOpen = false; },
    openInviteModal: (s) => { s.inviteModalOpen = true; },
    closeInviteModal: (s) => { s.inviteModalOpen = false; },
    showToast: (s, a) => { s.toast = a.payload; },
    clearToast: (s) => { s.toast = null; }
  }
});

export const { openTaskModal, closeTaskModal, openInviteModal, closeInviteModal, showToast, clearToast } = slice.actions;

export default slice.reducer;
