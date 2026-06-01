import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Image,
  Loader2,
  Paperclip,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
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

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const maxFileSize = 5 * 1024 * 1024;

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const formatSize = (size) => {
  if (!size) return "";
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export default function TaskModal({ open, onClose, projectId, task = null }) {
  const dispatch = useDispatch();
  const { currentRole, current } = useSelector((state) => state.projects);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const isEdit = Boolean(task?._id);
  const members = current?.members || [];
  const canAssign = currentRole === "admin";

  const previewUrl = useMemo(() => {
    if (!file) return null;
    if (!file.type.startsWith("image/")) return null;

    return URL.createObjectURL(file);
  }, [file]);

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

    setFile(null);
    setFileError("");
    setUploadProgress(0);
  }, [task, open]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open) return null;

  const validateFile = (selectedFile) => {
    if (!selectedFile) return "";

    if (!allowedTypes.includes(selectedFile.type)) {
      return "Only JPG, PNG, WEBP, GIF, PDF, DOC and DOCX files are allowed.";
    }

    if (selectedFile.size > maxFileSize) {
      return "File size must be less than 5MB.";
    }

    return "";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      setFileError("");
      return;
    }

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setFile(null);
      setFileError(validationError);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setFileError("");
    setUploadProgress(0);
  };

  const removeFile = () => {
    setFile(null);
    setFileError("");
    setUploadProgress(0);
  };

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
      let taskId = task?._id;

      if (isEdit) {
        const updated = await dispatch(
          updateTask({
            projectId,
            taskId: task._id,
            payload: form,
          })
        ).unwrap();

        taskId = updated._id;
      } else {
        const created = await dispatch(
          createTask({
            projectId,
            payload: form,
          })
        ).unwrap();

        taskId = created._id;
      }

      if (file && taskId) {
        await dispatch(
          uploadAttachment({
            projectId,
            taskId,
            file,
            onUploadProgress: (progress) => setUploadProgress(progress),
          })
        ).unwrap();
      }

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              {isEdit ? "Edit Task" : "Create Task"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add details, assign members and optionally attach a file.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-150px)] overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Task title
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. Design dashboard layout"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Write task description..."
                  className="min-h-32 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Due date
                  </label>
                  <div className="relative">
                    <Calendar
                      size={17}
                      className="pointer-events-none absolute left-3 top-3.5 text-slate-400"
                    />
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>

              {canAssign && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Assignees
                  </label>

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
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
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

            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Paperclip size={18} />
                <h3 className="font-bold text-slate-900">Attachment</h3>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Optional. Max 5MB. Supports images, PDF, DOC, DOCX.
              </p>

              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center transition hover:border-slate-900">
                <UploadCloud size={28} className="text-slate-500" />
                <span className="mt-2 text-sm font-semibold text-slate-800">
                  Click to upload
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  JPG, PNG, PDF, DOCX
                </span>

                <input
                  type="file"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={saving}
                />
              </label>

              {fileError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {fileError}
                </div>
              )}

              {file && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-slate-100">
                      {file.type === "application/pdf" ? (
                        <FileText size={40} className="text-red-500" />
                      ) : (
                        <Image size={40} className="text-slate-500" />
                      )}
                    </div>
                  )}

                  <div className="p-3">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {file.type || "file"} • {formatSize(file.size)}
                    </p>

                    {uploadProgress > 0 && (
                      <div className="mt-3">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-slate-950 transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Uploading {uploadProgress}%
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={saving}
                      className="mt-3 inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Remove file
                    </button>
                  </div>
                </div>
              )}

              {isEdit && task?.attachments?.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Existing files
                  </p>

                  <div className="space-y-2">
                    {task.attachments.map((item) => (
                      <a
                        key={item._id || item.publicId}
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs hover:bg-slate-50"
                      >
                        <CheckCircle2 size={14} className="text-green-600" />
                        <span className="line-clamp-1">
                          {item.fileName || "Attachment"}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={saving || !form.title.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving && <Loader2 size={17} className="animate-spin" />}
            {saving
              ? file
                ? "Saving & uploading..."
                : "Saving..."
              : isEdit
              ? "Update Task"
              : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}