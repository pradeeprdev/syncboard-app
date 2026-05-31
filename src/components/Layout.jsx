import React from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav onToggleSidebar={() => setMobileOpen((s) => !s)} />
      <div className="flex max-w-6xl mx-auto p-4 gap-4">
        <aside className={`w-60 ${mobileOpen ? 'block' : 'hidden'} md:block` }>
          <Sidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
