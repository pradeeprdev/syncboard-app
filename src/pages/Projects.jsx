import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  FolderKanban,
  Users,
  Archive,
  Loader2,
  AlertCircle,
  X,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, fetchProjects } from "../store/projectSlice";
import toast from "react-hot-toast";

const getId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value._id || value.id;
};

const roleClass = {
  admin: "bg-purple-100 text-purple-700",
  member: "bg-blue-100 text-blue-700",
  viewer: "bg-slate-100 text-slate-700",
};

export default function Projects() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [formError, setFormError] = useState({
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

    return member?.role || "viewer";
  };

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return list || [];

    return (list || []).filter((project) => {
      return (
        project.name?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.status?.toLowerCase().includes(q)
      );
    });
  }, [list, search]);

  const validateForm = () => {
    const errors = {
      name: "",
      description: "",
    };

    if (!form.name.trim()) {
      errors.name = "Project name is required.";
    } else if (form.name.trim().length < 3) {
      errors.name = "Project name must be at least 3 characters.";
    } else if (form.name.trim().length > 80) {
      errors.name = "Project name cannot be more than 80 characters.";
    }

    if (form.description.trim().length > 300) {
      errors.description = "Description cannot be more than 300 characters.";
    }

    setFormError(errors);

    return !errors.name && !errors.description;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (creating) return;

    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please fix the form errors.");
      return;
    }

    try {
      setCreating(true);

      await dispatch(
        createProject({
          name: form.name.trim(),
          description: form.description.trim(),
        })
      ).unwrap();

      toast.success("Project created successfully.");

      setForm({
        name: "",
        description: "",
      });

      setFormError({
        name: "",
        description: "",
      });
    } catch (err) {
      toast.error(err || "Failed to create project.");
    } finally {
      setCreating(false);
    }
  };

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
    });

    setFormError({
      name: "",
      description: "",
    });
  };

  return (
    <main className="min-h-screen bg-white/60 px-4 py-6">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 md:text-3xl">
                Projects
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Create projects, invite members, and manage work by roles.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <p className="text-xs text-slate-300">Total Projects</p>
                <p className="text-2xl font-bold">{list?.length || 0}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Active</p>
                <p className="text-2xl font-bold text-slate-950">
                  {(list || []).filter((p) => p.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleCreate}
            className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
              <div>
                <input
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));

                    if (formError.name) {
                      setFormError((prev) => ({
                        ...prev,
                        name: "",
                      }));
                    }
                  }}
                  placeholder="Project name"
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                    formError.name
                      ? "border-red-300 bg-red-50 focus:ring-red-200"
                      : "border-slate-200 bg-white focus:ring-slate-900"
                  }`}
                  maxLength={80}
                />

                {formError.name && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={13} />
                    {formError.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  value={form.description}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));

                    if (formError.description) {
                      setFormError((prev) => ({
                        ...prev,
                        description: "",
                      }));
                    }
                  }}
                  placeholder="Short description"
                  className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                    formError.description
                      ? "border-red-300 bg-red-50 focus:ring-red-200"
                      : "border-slate-200 bg-white focus:ring-slate-900"
                  }`}
                  maxLength={300}
                />

                <div className="mt-1 flex items-center justify-between">
                  {formError.description ? (
                    <p className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle size={13} />
                      {formError.description}
                    </p>
                  ) : (
                    <span />
                  )}

                  <p className="text-xs text-slate-400">
                    {form.description.length}/300
                  </p>
                </div>
              </div>

              <button
                disabled={creating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create
                  </>
                )}
              </button>

              {(form.name || form.description) && (
                <button
                  type="button"
                  onClick={clearForm}
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  <X size={17} />
                  Clear
                </button>
              )}
            </div>
          </form>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-3.5 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-slate-500 hover:text-slate-950"
              >
                Clear search
              </button>
            )}
          </div>

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
                  className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
                />
              ))}

            {!loading &&
              filteredProjects.map((project) => {
                const role = getUserRoleInProject(project);

                return (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                          <FolderKanban size={22} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-950 group-hover:underline">
                            {project.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {project.description || "No description"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          roleClass[role] || "bg-slate-100 text-slate-700"
                        }`}
                      >
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
                <p className="font-semibold text-slate-900">No projects yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Create your first project to start.
                </p>
              </div>
            )}

            {!loading && list.length > 0 && filteredProjects.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <p className="font-semibold text-slate-900">
                  No matching projects
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different search keyword.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}