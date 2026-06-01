import {
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    to: "/projects",
    icon: FolderKanban,
  },
];

export default function Sidebar({ open = false, onClose }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-white p-4 shadow-xl transition-transform duration-300 md:sticky md:top-20 md:z-10 md:h-[calc(100vh-6rem)] md:translate-x-0 md:rounded-3xl md:border md:border-slate-200 md:shadow-sm ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between md:hidden">
          <div>
            <h2 className="font-black text-slate-950">Menu</h2>
            <p className="text-xs text-slate-500">SyncBoard workspace</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="rounded-3xl bg-slate-950 p-4 text-white">
          <p className="text-xs text-slate-300">Workspace</p>
          <h3 className="mt-1 text-lg font-black">Pradeep's Workspace</h3>
          <p className="mt-2 text-xs leading-5 text-slate-300">
            Manage projects, members, tasks and real-time collaboration.
          </p>
        </div>

        <nav className="mt-5 space-y-2">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={linkClass}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Users size={17} className="text-slate-500" />
            <p className="text-sm font-bold text-slate-900">Team Ready</p>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Invite members from project detail and assign roles: admin, member,
            viewer.
          </p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 hidden rounded-2xl border border-slate-200 p-3 text-xs text-slate-500 md:block">
          <div className="flex items-center gap-2">
            <Settings size={15} />
            Settings coming soon
          </div>
        </div>
      </aside>
    </>
  );
}