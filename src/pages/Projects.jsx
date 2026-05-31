import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderKanban, Users, Archive } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, fetchProjects } from "../store/projectSlice";

const getId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value._id || value.id;
};

export default function Projects() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const getUserRoleInProject = (project) => {
    const userId = getId(user);
    const createdBy = getId(project.createdBy);

    if (String(createdBy) === String(userId)) return "admin";

    const member = project.members?.find(
      (m) => String(getId(m.user)) === String(userId)
    );

    return member?.role || null;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    await dispatch(createProject(form)).unwrap();

    setForm({
      name: "",
      description: "",
    });
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-950">
                Projects
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Create projects, invite members, and manage work by roles.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
              <p className="text-xs text-slate-300">Total Projects</p>
              <p className="text-2xl font-bold">{list.length}</p>
            </div>
          </div>

          <form
            onSubmit={handleCreate}
            className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Project name"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
            />

            <input
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Short description"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
            />

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-medium text-white hover:bg-slate-800">
              <Plus size={18} />
              Create
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {loading &&
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl border bg-slate-50"
                />
              ))}

            {!loading &&
              list.map((project) => {
                const role = getUserRoleInProject(project);

                return (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                          <FolderKanban size={22} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-950 group-hover:underline">
                            {project.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {project.description || "No description"}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                        {role}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Users size={15} />
                        {project.members?.length || 0} members
                      </span>

                      <span className="inline-flex items-center gap-1 capitalize">
                        <Archive size={15} />
                        {project.status}
                      </span>
                    </div>
                  </Link>
                );
              })}

            {!loading && list.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <p className="font-semibold text-slate-900">
                  No projects yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Create your first project to start.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}