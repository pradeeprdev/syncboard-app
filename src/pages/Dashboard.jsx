import {
  Bell,
  FolderKanban,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Users,
  Zap
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const demoProjects = [
  {
    name: "Website Redesign",
    tasks: 24,
    members: 5,
    status: "Active",
    progress: 72
  },
  {
    name: "Mobile App Launch",
    tasks: 18,
    members: 4,
    status: "Active",
    progress: 48
  },
  {
    name: "Marketing Sprint",
    tasks: 12,
    members: 3,
    status: "Review",
    progress: 86
  }
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white">
              S
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">SyncBoard</h1>
              <p className="text-xs text-slate-500">
                Real-time project workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex rounded-xl border bg-white px-3 py-2 text-sm font-semibold">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white"
            >
              <LogOut className="inline h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm text-indigo-200">Welcome back</p>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">
                {user?.name || "User"}
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Manage projects, assign tasks, track progress, and collaborate
                live with your team.
              </p>
            </div>

            <button className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 hover:bg-slate-100">
              <Plus className="inline mr-2 h-5 w-5" />
              New Project
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Projects", value: "03", icon: FolderKanban },
            { label: "Team Members", value: "12", icon: Users },
            { label: "Live Updates", value: "98%", icon: Zap },
            { label: "RBAC Secured", value: "On", icon: ShieldCheck }
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border bg-white p-5 shadow-sm"
            >
              <item.icon className="h-6 w-6 text-slate-700" />
              <p className="mt-4 text-3xl font-black">{item.value}</p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-black">Projects</h3>
              <p className="text-sm text-slate-500">
                This UI is ready. Next step: connect Project API.
              </p>
            </div>

            <div className="flex items-center rounded-2xl border px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                placeholder="Search projects..."
                className="ml-2 outline-none text-sm"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {demoProjects.map((project) => (
              <div
                key={project.name}
                className="rounded-3xl border border-slate-200 p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-black">{project.name}</h4>
                    <p className="text-sm text-slate-500">
                      {project.tasks} tasks • {project.members} members
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                    {project.status}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-bold">{project.progress}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-950"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <button className="mt-5 w-full rounded-2xl border py-3 font-bold hover:bg-slate-50">
                  Open Project
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}