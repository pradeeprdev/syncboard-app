import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "../store/projectSlice";
import { fetchTasks, createTask, uploadAttachment, addTaskOptimistic, bulkDelete, bulkUpdateStatus } from "../store/taskSlice";
import { getSocket, connectSocket } from "../lib/socket";
import { useProjectRole } from "../hooks/useProjectRole";
import TaskModal from "../components/TaskModal";
import InviteModal from "../components/InviteModal";
import ActivityPanel from "../components/ActivityPanel";
import NotificationsPanel from "../components/NotificationsPanel";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { current } = useSelector((s) => s.projects);
  const { list: tasks } = useSelector((s) => s.tasks);
  const tasksLoading = useSelector((s) => s.tasks.loading);
  const userRole = useProjectRole(current);
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    dispatch(fetchTasks({ projectId }));

    const token = localStorage.getItem("accessToken");
    const socket = connectSocket(token);
    socket.emit("project:join", { projectId });

    socket.on("task:created", ({ task }) => {
      dispatch(addTaskOptimistic(task));
    });

    socket.on("task:updated", ({ task }) => {
      dispatch({ type: "tasks/replaceTask", payload: task });
    });

    return () => {
      socket.emit("project:leave", { projectId });
    };
  }, [dispatch, projectId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleUpload = async (taskId, file) => {
    await dispatch(uploadAttachment({ projectId, taskId, file }));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold">{current?.name || "Project"}</h1>
        <p className="text-slate-600">{current?.description}</p>

        <div className="mt-6">
          {userRole === 'admin' || userRole === 'member' ? (
            <button onClick={handleCreate} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-800">New Task</button>
          ) : (
            <div className="text-sm text-slate-500">Viewers cannot create tasks</div>
          )}
        </div>
        <TaskModal open={showModal} onClose={() => setShowModal(false)} projectId={projectId} />

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" onChange={(e) => setSelected(e.target.checked ? tasks.map(t=>t._id) : [])} checked={selected.length===tasks.length && tasks.length>0} />
            <div className="text-sm">Select all</div>
            {selected.length>0 && (
              <div className="ml-auto flex gap-2">
                {userRole === 'admin' && (
                  <button onClick={async ()=>{ await dispatch(bulkDelete({ projectId, taskIds: selected })); setSelected([]); }} className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded">Delete ({selected.length})</button>
                )}
                {(userRole === 'admin' || userRole === 'member') && (
                  <button onClick={async ()=>{ await dispatch(bulkUpdateStatus({ projectId, taskIds: selected, status: 'done' })); setSelected([]); }} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded">Mark Done</button>
                )}
              </div>
            )}
          </div>

          {tasksLoading && (
            <div className="space-y-3 col-span-1 md:col-span-2">
              <div className="animate-pulse bg-white rounded-lg p-4 border">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
              <div className="animate-pulse bg-white rounded-lg p-4 border">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          )}

          {!tasksLoading && tasks.map((t) => (
            <div key={t._id} className="p-4 border rounded-lg flex items-start justify-between">
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selected.includes(t._id)} onChange={(e)=>{
                  if(e.target.checked) setSelected(s=>Array.from(new Set([...s, t._id])));
                  else setSelected(s=>s.filter(id=>id!==t._id));
                }} />
                <div>
                  <h4 className="font-semibold">{t.title}</h4>
                  <p className="text-sm text-slate-500">Status: {t.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-block">
                  <input type="file" className="hidden" onChange={(e) => handleUpload(t._id, e.target.files[0])} disabled={userRole === 'viewer'} />
                  <span className={`px-3 py-1 border rounded ${userRole === 'viewer' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200'}`}>Attach</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          {userRole === 'admin' && (
            <button onClick={() => setShowInvite(true)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded">Invite Member</button>
          )}
          {userRole === 'viewer' && (
            <div className="text-sm text-slate-500">Viewers cannot invite members</div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivityPanel projectId={projectId} />
          <NotificationsPanel projectId={projectId} />
        </div>
        <InviteModal open={showInvite} onClose={() => setShowInvite(false)} projectId={projectId} />
      </div>
    </div>
  );
}
