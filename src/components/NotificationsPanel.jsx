import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { markNotificationRead, fetchNotifications } from "../store/notificationSlice";

export default function NotificationsPanel({ projectId }) {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.notifications);

  React.useEffect(() => {
    if (projectId) dispatch(fetchNotifications({ projectId }));
  }, [dispatch, projectId]);

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="p-2">
      <h3 className="font-semibold">Notifications</h3>
      <ul>
        {list.map((n) => (
          <li key={n._id} className={`py-1 ${n.read ? 'text-gray-500' : 'font-medium'}`}>
            <div>{n.message}</div>
            <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
            {!n.read && (
              <button className="text-sm text-blue-600" onClick={() => dispatch(markNotificationRead({ projectId, notificationId: n._id }))}>
                Mark read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
