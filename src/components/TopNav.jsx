import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { disconnectSocket } from "../lib/socket";

export default function TopNav({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const handleLogout = () => {
    disconnectSocket?.();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-slate-950 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <Link to="/projects" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
              SB
            </div>

            <div className="leading-tight">
              <p className="text-lg font-black text-slate-950">SyncBoard</p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Real-time project workspace
              </p>
            </div>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>
          </nav>
        </div>

        <div className="hidden max-w-md flex-1 px-6 lg:block">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-2.5 text-slate-400"
            />
            <input
              disabled
              placeholder="Search coming soon..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500" />
          </button>

          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
              {initials}
            </div>

            <div className="max-w-36 leading-tight">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || "Logged in"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}