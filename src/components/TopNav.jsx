import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Link } from "react-router-dom";

export default function TopNav({ onToggleSidebar }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <button onClick={onToggleSidebar} className="md:hidden p-2 rounded hover:bg-slate-100">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link to="/dashboard" className="text-xl font-bold">SyncBoard</Link>
          <nav className="hidden md:flex gap-3 text-sm text-slate-600">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/projects" className="hover:underline">Projects</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm mr-2">{user?.name}</div>
          <button onClick={() => dispatch(logout())} className="bg-black text-white px-3 py-1 rounded">Logout</button>
        </div>
      </div>
    </header>
  );
}
