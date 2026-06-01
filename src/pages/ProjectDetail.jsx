import { useEffect, useMemo, useState } from "react";
import { Activity, Mail, Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  fetchProjectById,
  fetchActivity,
  inviteMember,
  clearInviteResult,
  fetchInvitations,
} from "../store/projectSlice";
import { showToast } from "../store/uiSlice";

import {
  fetchTasks,
  deleteTask,
  bulkUpdateStatus,
  bulkDeleteTasks,
  toggleTaskSelection,
  clearTaskSelection,
  addTaskFromSocket,
  updateTaskFromSocket,
  deleteTaskFromSocket,
  bulkUpdateFromSocket,
  bulkDeleteFromSocket,
} from "../store/taskSlice";

import { connectSocket } from "../lib/socket";

import TaskModal from "../components/TaskModal";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskCard from "../components/tasks/TaskCard";
import BulkTaskActions from "../components/tasks/BulkTaskActions";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const {
    current,
    currentRole,
    activity,
    inviteResult,
    invitations,
  } = useSelector((state) => state.projects);

  const {
    list: tasks,
    loading,
    selectedIds,
    pagination,
    error,
  } = useSelector((state) => state.tasks);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member",
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sort: "-createdAt",
    page: 1,
    limit: 20,
  });
  const [showAllActivity, setShowAllActivity] = useState(false);

  const visibleActivity = showAllActivity
    ? activity || []
    : (activity || []).slice(0, 5);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [copiedInvite, setCopiedInvite] = useState(false);
  const canCreate = currentRole === "admin" || currentRole === "member";
  const canEdit = currentRole === "admin" || currentRole === "member";
  const canDelete = currentRole === "admin";
  const canInvite = currentRole === "admin";

  const query = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    return params.toString() ? `?${params.toString()}` : "";
  }, [filters]);

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    dispatch(fetchActivity(projectId));
  }, [dispatch, projectId]);

  // fetch pending invites when role is known and user can invite
  useEffect(() => {
    if (canInvite) dispatch(fetchInvitations(projectId));
  }, [canInvite, dispatch, projectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchTasks({ projectId, query }));
    }, 350);

    return () => clearTimeout(timer);
  }, [dispatch, projectId, query]);

  useEffect(() => {
    const socket = connectSocket();

    socket.emit("project:join", { projectId });

    socket.on("task:created", ({ task }) => {
      dispatch(addTaskFromSocket(task));
    });

    socket.on("task:updated", ({ task }) => {
      dispatch(updateTaskFromSocket(task));
    });

    socket.on("task:deleted", ({ taskId }) => {
      dispatch(deleteTaskFromSocket(taskId));
    });

    socket.on("task:bulk-updated", (payload) => {
      dispatch(bulkUpdateFromSocket(payload));
    });

    socket.on("task:bulk-deleted", ({ taskIds }) => {
      dispatch(bulkDeleteFromSocket(taskIds));
    });

    socket.on("notification:new", (data) => {
      console.log("New Notification:", data);
    });

    return () => {
      socket.emit("project:leave", { projectId });

      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("task:bulk-updated");
      socket.off("task:bulk-deleted");
      socket.off("notification:new");
    };
  }, [dispatch, projectId]);

  const openCreateTask = () => {
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    await dispatch(deleteTask({ projectId, taskId })).unwrap();
  };

  const handleBulkCompleted = async () => {
    await dispatch(
      bulkUpdateStatus({
        projectId,
        taskIds: selectedIds,
        status: "completed",
      })
    ).unwrap();

    dispatch(clearTaskSelection());
  };

  const handleBulkDelete = async () => {
    await dispatch(
      bulkDeleteTasks({
        projectId,
        taskIds: selectedIds,
      })
    ).unwrap();

    dispatch(clearTaskSelection());
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    setInviteError("");
    setCopiedInvite(false);

    if (!inviteForm.email.trim()) {
      setInviteError("Email is required.");
      return;
    }

    if (!isValidEmail(inviteForm.email.trim())) {
      setInviteError("Please enter a valid email address.");
      return;
    }

    try {
      setInviteLoading(true);

      await dispatch(
        inviteMember({
          projectId,
          email: inviteForm.email.trim(),
          role: inviteForm.role,
        })
      ).unwrap();

      setInviteForm({
        email: "",
        role: "member",
      });

      dispatch(fetchActivity(projectId));
    } catch (err) {
      setInviteError(err || "Failed to generate invite link.");
    } finally {
      setInviteLoading(false);
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedInvite(true);

      setTimeout(() => {
        setCopiedInvite(false);
      }, 1800);
    } catch {
      setInviteError("Unable to copy. Please copy manually.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-6xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 md:text-3xl">
                {current?.name || "Project"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {current?.description || "Manage project tasks."}
              </p>

              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Your role: {currentRole || "loading..."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canInvite && (
                <button
                  onClick={() => setInviteOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  <Mail size={18} />
                  Invite Member
                </button>
              )}

              {canCreate && (
                <button
                  onClick={openCreateTask}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <Plus size={18} />
                  New Task
                </button>
              )}
            </div>
          </div>
        </div>

        {inviteOpen && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-950">Invite Member</h2>
                <p className="text-sm text-slate-500">
                  Generate a secure invite link and assign project role.
                </p>
              </div>

              <button
                type="button"
                disabled={inviteLoading}
                onClick={() => {
                  setInviteOpen(false);
                  setInviteError("");
                  setCopiedInvite(false);
                  dispatch(clearInviteResult());
                }}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleInvite}
              className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]"
            >
              <div>
                <input
                  type="email"
                  value={inviteForm.email}
                  disabled={inviteLoading}
                  onChange={(e) => {
                    setInviteForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));

                    if (inviteError) setInviteError("");
                  }}
                  placeholder="member@example.com"
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${inviteError
                      ? "border-red-300 bg-red-50 focus:ring-red-200"
                      : "border-slate-200 bg-white focus:ring-slate-900"
                    }`}
                />

                {inviteError && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {inviteError}
                  </p>
                )}
              </div>

              <select
                value={inviteForm.role}
                disabled={inviteLoading}
                onChange={(e) =>
                  setInviteForm((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-60"
              >
                <option value="admin">Project Admin</option>
                <option value="member">Team Member</option>
                <option value="viewer">Viewer</option>
              </select>

              <button
                disabled={inviteLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {inviteLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </form>

            {inviteResult?.inviteLink && (
              <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Invite link generated
                    </p>
                    <p className="text-xs text-green-700">
                      Share this link with the invited member.
                    </p>
                  </div>

                  {copiedInvite && (
                    <span className="rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                      Copied
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    readOnly
                    value={inviteResult.inviteLink}
                    className="min-w-0 flex-1 rounded-xl border border-green-200 bg-white px-3 py-2 text-sm text-slate-700"
                  />

                  <button
                    type="button"
                    onClick={() => copyText(inviteResult.inviteLink)}
                    className="rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            {Array.isArray(invitations) && invitations.length > 0 && (
              <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">
                      Pending Invitations
                    </p>
                    <p className="text-xs text-yellow-700">
                      Invitations that have not been accepted yet.
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-900">
                    {invitations.length}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {invitations.map((inv) => (
                    <div
                      key={inv._id || `${inv.email}-${inv.createdAt}`}
                      className="flex flex-col gap-3 rounded-xl border border-yellow-100 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {inv.email}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Role:{" "}
                          <span className="font-semibold capitalize">{inv.role}</span>
                          {" "}• Expires:{" "}
                          {inv.expiresAt
                            ? new Date(inv.expiresAt).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyText(inv.email)}
                        className="rounded-lg bg-yellow-600 px-3 py-2 text-xs font-semibold text-white hover:bg-yellow-700"
                      >
                        Copy Email
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(invitations) && invitations.length === 0 && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                No pending invitations.
              </div>
            )}
          </div>
        )}

        <TaskFilters filters={filters} setFilters={setFilters} />

        <BulkTaskActions
          selectedCount={selectedIds.length}
          onMarkCompleted={handleBulkCompleted}
          onBulkDelete={handleBulkDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {loading &&
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-3xl bg-white"
              />
            ))}

          {!loading &&
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                selected={selectedIds.includes(task._id)}
                onSelect={() => dispatch(toggleTaskSelection(task._id))}
                onEdit={() => openEditTask(task)}
                onDelete={() => handleDeleteTask(task._id)}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            ))}

          {!loading && tasks.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-semibold text-slate-950">No tasks found</p>
              <p className="mt-1 text-sm text-slate-500">
                Create a task or adjust your filters.
              </p>
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
            <button
              disabled={filters.page <= 1}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Number(prev.page) - 1,
                }))
              }
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>

            <button
              disabled={filters.page >= pagination.totalPages}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Number(prev.page) + 1,
                }))
              }
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Activity size={20} />
              <h2 className="font-bold text-slate-950">Project Activity</h2>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {activity?.length || 0}
            </span>
          </div>

          <div className="space-y-3">
            {visibleActivity.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-900">
                  {item.action}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  By {item.userId?.name || "User"} •{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            {activity?.length === 0 && (
              <p className="text-sm text-slate-500">No activity yet.</p>
            )}
          </div>

          {activity?.length > 5 && (
            <button
              onClick={() => setShowAllActivity((prev) => !prev)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {showAllActivity ? (
                <>
                  Show less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show all activity <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </section>

      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        projectId={projectId}
        task={editingTask}
      />
    </main>
  );
}