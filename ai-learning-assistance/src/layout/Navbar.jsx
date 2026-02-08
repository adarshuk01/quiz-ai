import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <header className="h-16  bg-white border-b border-gray-300 flex items-center justify-between px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-gray-600"
          onClick={onMenuClick}
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search */}
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

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            onClick={() => setOpen(!open)}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover cursor-pointer"
          />

          {/* Dropdown */}
          {open && (
            <div className="absolute z-50 right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiUser size={16} />
                My Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FiLogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
