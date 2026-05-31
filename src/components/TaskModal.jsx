import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createTask, uploadAttachment } from "../store/taskSlice";
import { useProjectRole } from "../hooks/useProjectRole";

export default function TaskModal({ open, onClose, projectId }) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { current: project } = useSelector((s) => s.projects);
  const userRole = useProjectRole(project);
  const canCreate = userRole === 'admin' || userRole === 'member';

  const onSubmit = async (data) => {
    if (!canCreate) return;
    const res = await dispatch(createTask({ projectId, payload: { title: data.title, description: data.description } }));
    if (createTask.fulfilled.match(res)) {
      // upload file if present
      if (data.file && data.file.length) {
        const task = res.payload;
        await dispatch(uploadAttachment({ projectId, taskId: task._id, file: data.file[0] }));
      }

      reset();
      onClose();
    }
  };

  if (!open) return null;
  if (!canCreate) return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-red-600">Access Denied</h3>
        <p className="mt-2 text-slate-600">Only admins and members can create tasks.</p>
        <button onClick={onClose} className="mt-4 px-3 py-2 bg-slate-100 rounded">Close</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Create Task</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("title", { required: true })} placeholder="Title" className="w-full border rounded px-3 py-2" />
          <textarea {...register("description")} placeholder="Description" className="w-full border rounded px-3 py-2" />
          <input type="file" {...register("file")} />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2">Cancel</button>
            <button type="submit" className="bg-black text-white px-3 py-2 rounded hover:bg-slate-800">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
