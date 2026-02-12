import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen ">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-50 top-0 left-0 h-full
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Right side */}
      <div className="flex flex-col flex-1 lg:h-screen  overflow-scroll">
        {/* Navbar */}
        <div className="sticky top-0 z-30 bg-white">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50 px-4 py-2 md:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
