import React from "react";

function Select({
  label,
  options = [],
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <select
        className={`w-full rounded-lg border px-3 py-2 text-sm bg-white
        ${error ? "border-red-500" : "border-gray-200"}
        focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default Select;
