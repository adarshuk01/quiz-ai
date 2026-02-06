import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBookOpen,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiCreditCard,
  FiHelpCircle,
} from "react-icons/fi";
import { FaQuestion, FaWandMagicSparkles } from "react-icons/fa6";
import { LuFileQuestion } from "react-icons/lu";

function Sidebar() {
  const menu = [
    { name: "Dashboard", icon: <FiGrid />, path: "/" },
    { name: "Question Sets", icon: <LuFileQuestion />, path: "/question-sets" },
    { name: "My Quizzes", icon: <FiBookOpen />, path: "/quizzes" },
    { name: "Students", icon: <FiUsers />, path: "/students" },
    { name: "Reports", icon: <FiBarChart2 />, path: "/reports" },
  ];

  const settings = [
    { name: "Preferences", icon: <FiSettings />, path: "/preferences" },
    { name: "Billing", icon: <FiCreditCard />, path: "/billing" },
  ];

  const linkClass =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium";

  return (
    <div className="w-64 h-screen bg-gray-100 flex flex-col justify-between p-4">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-lg font-bold">
            ✦
          </div>
          <span className="text-lg font-semibold text-gray-800">QuizAI</span>
        </div>

        {/* Main Menu */}
        <nav className="space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`
              }
              end={item.path === "/"} // only exact match for dashboard
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Settings */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 font-semibold tracking-wider mb-2">
            SETTINGS
          </p>
          <div className="space-y-1">
            {settings.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `${linkClass} ${
                    isActive
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-200"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t pt-4">
        <NavLink
          to="/help"
          className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800"
        >
          <FiHelpCircle />
          Help & Support
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
