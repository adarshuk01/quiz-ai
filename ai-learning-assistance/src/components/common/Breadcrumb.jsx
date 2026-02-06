import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center text-sm text-gray-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            {isLast ? (
              <span className="text-gray-800 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-indigo-600 transition"
              >
                {item.label}
              </Link>
            )}

            {!isLast && (
              <FiChevronRight className="mx-2 text-gray-400" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
