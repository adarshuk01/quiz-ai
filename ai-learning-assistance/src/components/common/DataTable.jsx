import React from "react";
import { FiSearch } from "react-icons/fi";

function DataTable({
  columns = [],
  data = [],
  searchValue = "",
  onSearch,
  actions,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-gray-300">
        <div className="relative w-full sm:max-w-sm">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {actions && (
          <div className="flex flex-wrap gap-2 justify-end">
            {actions}
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-gray-300 hover:bg-gray-50 transition"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {col.render
                        ? col.render(row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden divide-y divide-gray-300">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No data found
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div key={rowIndex} className="p-4 space-y-2">
              {columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-500 font-medium">
                    {col.header}
                  </span>
                  <span className="text-gray-900  text-right">
                    {col.render
                      ? col.render(row)
                      : row[col.accessor]}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DataTable;
