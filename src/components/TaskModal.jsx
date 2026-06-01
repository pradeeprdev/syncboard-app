import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask, uploadAttachment } from "../store/taskSlice";

const initialForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assignees: [],
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

export default function TaskModal({
  open,
  onClose,
  projectId,
  task = null,
}) {
  const dispatch = useDispatch();
  const { currentRole, current } = useSelector((state) => state.projects);
  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isEdit = Boolean(task?._id);
  const members = current?.members || [];

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        assignees: task.assignees?.map(getId) || [],
      });
    } else {
      setForm(initialForm);
    }
  }, [task, open]);

  if (!open) return null;

  const canAssign = currentRole === "admin";

  const toggleAssignee = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(userId)
        ? prev.assignees.filter((id) => id !== userId)
        : [...prev.assignees, userId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    setSaving(true);

    try {
      if (isEdit) {
        await dispatch(
          updateTask({
            projectId,
            taskId: task._id,
            payload: form,
          })
        ).unwrap();

        if (file) {
          await dispatch(
            uploadAttachment({
              projectId,
              taskId: task._id,
              file,
              onUploadProgress: (p) => setUploadProgress(p),
            })
          ).unwrap();
        }
      } else {
        const created = await dispatch(
          createTask({ projectId, payload: form })
        ).unwrap();

        if (file) {
          await dispatch(
            uploadAttachment({
              projectId,
              taskId: created._id,
              file,
              onUploadProgress: (p) => setUploadProgress(p),
            })
          ).unwrap();
        }
      }

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              {isEdit ? "Edit Task" : "Create Task"}
            </h2>
            <p className="text-sm text-slate-500">
              Manage title, priority, status, due date and assignees.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Attachment</label>
            <input
              type="file"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />

            {uploadProgress > 0 && (
              <div className="mt-2 text-sm text-slate-600">Uploading: {uploadProgress}%</div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <input
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Task title"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Task description"
            className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={form.priority}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {canAssign && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Assignees
              </p>

              <div className="flex flex-wrap gap-2">
                {members.map((member) => {
                  const id = getId(member.user);
                  const name =
                    member.user?.name || member.user?.email || "User";

                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => toggleAssignee(id)}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        form.assignees.includes(id)
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}

                {members.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No members found.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
}