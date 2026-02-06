import React from "react";
import { FiSearch, FiBell, FiMenu } from "react-icons/fi";

function Navbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden text-gray-600"
          onClick={onMenuClick}
        >
          <FiMenu size={22} />
        </button>

        <h1 className="text-lg font-semibold text-gray-800">
          Dashboard
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search (hidden on small screens) */}
        <div className="relative hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes, students..."
            className="pl-10 pr-4 py-2 w-60 md:w-72 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Notification */}
        <button className="text-gray-500 hover:text-gray-700">
          <FiBell size={20} />
        </button>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
        />
      </div>
    </header>
  );
}

export default Navbar;
