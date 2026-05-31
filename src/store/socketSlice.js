import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "socket",
  initialState: { connected: false },
  reducers: {
    setConnected: (s, a) => {
      s.connected = a.payload;
    }
  }
});

export const { setConnected } = slice.actions;

export default slice.reducer;
