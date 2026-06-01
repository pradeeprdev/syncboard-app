import {
  Calendar,
  Edit3,
  Trash2,
  UserRound,
  Image,
  FileText,
  ExternalLink,
} from "lucide-react";

const statusLabel = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
};

const priorityClass = {
  low: "bg-green-100 text-green-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const isImage = (attachment) => {
  return attachment.mimeType?.startsWith("image/");
};

const isPdf = (attachment) => {
  return attachment.mimeType === "application/pdf";
};

const formatSize = (size) => {
  if (!size) return "";
  return `${(size / 1024).toFixed(1)} KB`;
};

export default function TaskCard({
  task,
  selected,
  onSelect,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="mt-1 h-4 w-4"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="font-bold text-slate-950">{task.title}</h3>

              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {task.description || "No description"}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
                  title="Edit task"
                >
                  <Edit3 size={16} />
                </button>
              )}

              {canDelete && (
                <button
                  onClick={onDelete}
                  className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  title="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {statusLabel[task.status] || task.status}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                priorityClass[task.priority] || "bg-slate-100 text-slate-700"
              }`}
            >
              {task.priority}
            </span>

            {task.dueDate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <Calendar size={13} />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {task.assignees?.length > 0 ? (
              task.assignees.map((user) => (
                <span
                  key={user._id || user}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                >
                  <UserRound size={13} />
                  {user.name || user.email || "User"}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No assignee</span>
            )}
          </div>

          {task.attachments?.length > 0 && (
            <div className="mt-5 border-t pt-4">
              <p className="text-sm font-semibold text-slate-700">
                Attachments
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {task.attachments.map((a) => (
                  <div
                    key={a._id || a.publicId}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    {isImage(a) ? (
                      <a href={a.fileUrl} target="_blank" rel="noreferrer">
                        <img
                          src={a.fileUrl}
                          alt={a.fileName || "Attachment"}
                          className="h-36 w-full object-cover"
                        />
                      </a>
                    ) : isPdf(a) ? (
                      <div className="flex h-36 items-center justify-center bg-white">
                        <FileText size={42} className="text-red-500" />
                      </div>
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-white">
                        <Image size={42} className="text-slate-400" />
                      </div>
                    )}

                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-medium text-slate-800">
                        {a.fileName || a.publicId}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {a.mimeType || "file"}{" "}
                        {a.size ? `• ${formatSize(a.size)}` : ""}
                      </p>

                      <a
                        href={a.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:underline"
                      >
                        Open file
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}