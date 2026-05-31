import { Trash2 } from "lucide-react";

export default function BulkTaskActions({
  selectedCount,
  onMarkCompleted,
  onBulkDelete,
  canEdit,
  canDelete,
}) {
  if (!selectedCount) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-slate-950">
          {selectedCount} task(s) selected
        </p>

        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <button
              onClick={onMarkCompleted}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Mark Completed
            </button>
          )}

          {canDelete && (
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </div>
  );
}