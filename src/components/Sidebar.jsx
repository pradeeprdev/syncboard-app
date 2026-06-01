import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sticky top-6">
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Workspace</h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/projects">Projects</Link></li>
        </ul>
      </div>
    </div>
  );
}
