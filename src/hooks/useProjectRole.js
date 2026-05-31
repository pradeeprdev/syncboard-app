import { useSelector } from "react-redux";

const getId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value._id || value.id;
};

export const useProjectRole = (project) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !project) return null;

  const userId = getId(user);
  const createdBy = getId(project.createdBy);

  if (String(createdBy) === String(userId)) {
    return "admin";
  }

  const member = project.members?.find(
    (m) => String(getId(m.user)) === String(userId)
  );

  return member?.role || null;
};