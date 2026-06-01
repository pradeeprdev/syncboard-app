import React from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useDispatch } from "react-redux";
import { useProjectRole } from "../hooks/useProjectRole";
import { inviteMember, fetchInvitations } from "../store/projectSlice";
import { showToast } from "../store/uiSlice";

export default function InviteModal({ open, onClose, projectId }) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { current: project } = useSelector((s) => s.projects);
  const userRole = useProjectRole(project);
  const canInvite = userRole === 'admin';

  const onSubmit = async (data) => {
    if (!canInvite) return;
    try {
      const res = await dispatch(inviteMember({ projectId, email: data.email, role: data.role })).unwrap();

      dispatch(showToast({ type: "success", message: res.message || "Invitation created" }));
      // refresh invites list
      dispatch(fetchInvitations(projectId));

      reset();
      onClose();
    } catch (err) {
      const msg = err?.message || err || 'Invite failed';
      dispatch(showToast({ type: "error", message: msg }));
    }
  };

  if (!open) return null;

  if (!canInvite) return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-red-600">Access Denied</h3>
        <p className="mt-2 text-slate-600">Only project admins can invite members.</p>
        <button onClick={onClose} className="mt-4 px-3 py-2 bg-slate-100 rounded">Close</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Invite Member</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("email", { required: true })} placeholder="Email" className="w-full border rounded px-3 py-2" />
          <select {...register("role")} className="w-full border rounded px-3 py-2">
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2">Cancel</button>
            <button type="submit" className="bg-black text-white px-3 py-2 rounded hover:bg-slate-800">Invite</button>
          </div>
        </form>
      </div>
    </div>
  );
}
