import { useSelector } from 'react-redux';

export const useProjectRole = (project) => {
  const { user } = useSelector((s) => s.auth);
  if (!user || !project) return null;

  // normalize user id (backend may return `_id` or `id`)
  const uid = user._id || user.id || user._id?.toString?.();

  const isCreator = String(project.createdBy) === String(uid);
  const member = project.members?.find(m => String(m.user) === String(uid));

  if (isCreator) return 'admin';
  return member?.role || null;
};
