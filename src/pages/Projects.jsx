import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, createProject } from "../store/projectSlice";
import { useProjectRole } from "../hooks/useProjectRole";
import { Link } from "react-router-dom";

export default function Projects() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    await dispatch(createProject({ name }));
    setName("");
  };

  const getUserRoleInProject = (project) => {
    if (String(project.createdBy) === String(user?.id)) return 'admin';
    const member = project.members?.find(m => String(m.user) === String(user?.id));
    return member?.role || null;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projects</h1>
        </div>

        <form onSubmit={handleCreate} className="mt-6 flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New project name" className="flex-1 border rounded-lg px-4 py-2" />
          <button className="bg-black text-white px-4 py-2 rounded-lg">Create</button>
        </form>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && (
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="animate-pulse bg-white rounded-lg p-4 border">
                  <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="animate-pulse bg-white rounded-lg p-4 border">
                  <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          )}

          {!loading && list.map((p) => {
            const role = getUserRoleInProject(p);
            const roleColors = { admin: 'bg-purple-100 text-purple-800', member: 'bg-blue-100 text-blue-800', viewer: 'bg-slate-100 text-slate-800' };
            return (
              <Link key={p._id} to={`/projects/${p._id}`} className="block p-4 border rounded-lg hover:shadow transition-shadow duration-150">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  {role && <span className={`text-xs px-2 py-1 rounded ${roleColors[role] || ''}`}>{role}</span>}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
                <div className="mt-2 text-xs text-slate-400">{p.members?.length || 0} members</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
