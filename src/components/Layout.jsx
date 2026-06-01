import { useState } from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openSidebar = () => setMobileOpen(true);
  const closeSidebar = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <TopNav onToggleSidebar={openSidebar} />

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 md:grid-cols-[280px_1fr]">
        <Sidebar open={mobileOpen} onClose={closeSidebar} />

        <main className="min-w-0">
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-3 shadow-sm backdrop-blur sm:p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}