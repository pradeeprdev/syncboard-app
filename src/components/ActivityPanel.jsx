import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function ActivityPanel({ projectId }) {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    let mounted = true;
    api.get(`/projects/${projectId}/activity`).then((res) => {
      if (!mounted) return;
      setActivity(res.data.data.activity || []);
    });
    return () => (mounted = false);
  }, [projectId]);

  return (
    <div className="mt-6 bg-white border rounded p-4">
      <h4 className="font-semibold mb-2">Activity</h4>
      <div className="space-y-2 text-sm text-slate-600 max-h-64 overflow-auto">
        {activity.map((a) => (
          <div key={a._id} className="border-b pb-2">
            <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</div>
            <div>{a.action} — {a.metadata?.title || a.metadata?.email || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
