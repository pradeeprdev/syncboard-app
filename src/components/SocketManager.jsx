import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket, getSocket } from "../lib/socket";
import { setConnected } from "../store/socketSlice";
import { pushNotification } from "../store/notificationSlice";
import { replaceTask, addTaskOptimistic } from "../store/taskSlice";

export default function SocketManager() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);
    dispatch(setConnected(true));

    socket.on("connect", () => dispatch(setConnected(true)));
    socket.on("disconnect", () => dispatch(setConnected(false)));

    socket.on("notification:new", (payload) => {
      dispatch(pushNotification(payload));
    });

    socket.on("task:created", ({ task }) => {
      dispatch(addTaskOptimistic(task));
    });

    socket.on("task:updated", ({ task }) => {
      dispatch(replaceTask(task));
    });

    return () => {
      disconnectSocket();
      dispatch(setConnected(false));
    };
  }, [dispatch, token]);

  return null;
}
