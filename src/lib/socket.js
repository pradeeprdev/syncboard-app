import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");

  if (!socket) {
    socket = io(
      import.meta.env.VITE_SOCKET_URL ||
        "http://localhost:5000",
      {
        auth: {
          token,
        },

        transports: ["websocket"],

        autoConnect: true,

        reconnection: true,

        reconnectionAttempts: 10,

        reconnectionDelay: 1000,
      }
    );

    socket.on("connect", () => {
    });

    socket.on("disconnect", () => {
    });

    socket.on("connect_error", (error) => {
      console.log(
        "Socket Error:",
        error.message
      );
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};