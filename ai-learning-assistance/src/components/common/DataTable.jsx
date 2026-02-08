import React, { useState, useMemo, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

function DataTable({
  columns = [],
  data = [],
  searchValue = "",
  onSearch,
  actions,
  loading = false,
  skeletonRows = 5,
}) {
  const rowsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage]);

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
            {loading ? (
              [...Array(skeletonRows)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-gray-300">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
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

      {/* Mobile Layout */}
      <div className="md:hidden divide-y divide-gray-300">
        {loading ? (
          [...Array(skeletonRows)].map((_, rowIndex) => (
            <div key={rowIndex} className="p-4 space-y-3">
              {columns.map((_, colIndex) => (
                <div key={colIndex} className="flex justify-between">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ))
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No data found
          </div>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <div key={rowIndex} className="p-4 space-y-2">
              {columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-500 font-medium">
                    {col.header}
                  </span>
                  <span className="text-gray-900 text-right">
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-300">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded border ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "text-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
