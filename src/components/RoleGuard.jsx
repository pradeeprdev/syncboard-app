import React from "react";
import { useSelector } from "react-redux";

export default function RoleGuard({ allowed = [], children }) {
  const { user } = useSelector((s) => s.auth);
  const role = user?.projectRole || null; // frontend-assigned role per-project

  if (!allowed.length) return children;

  if (!role) return null;

  return allowed.includes(role) ? children : null;
}
