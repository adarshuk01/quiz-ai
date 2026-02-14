import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

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
          fixed top-0 left-0 h-screen w-64 z-50 bg-white
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Right Content */}
      <div className="flex flex-col flex-1 md:ml-64">

        {/* Navbar (fixed height) */}
        <div className="fixed top-0 left-0 right-0 md:left-64 h-16 z-30 bg-white shadow-sm">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto mt-16 px-4 py-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default Layout;
