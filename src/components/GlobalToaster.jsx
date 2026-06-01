import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { clearToast } from "../store/uiSlice";

export default function GlobalToaster() {
  const dispatch = useDispatch();
  const uiToast = useSelector((s) => s.ui.toast);

  useEffect(() => {
    if (!uiToast) return;

    const { type = "info", message = "" } = uiToast;

    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast(message);

    const t = setTimeout(() => dispatch(clearToast()), 1500);
    return () => clearTimeout(t);
  }, [uiToast, dispatch]);

  return null;
}
