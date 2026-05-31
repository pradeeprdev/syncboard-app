import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL || "http://localhost:5050") , {
    auth: { token }
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
