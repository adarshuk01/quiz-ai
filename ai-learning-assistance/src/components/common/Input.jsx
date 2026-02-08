import React from "react";

function Input({
  label,
  icon,
  error,
  type,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={`flex items-center rounded-lg border px-3 py-2 bg-white
        ${error ? "border-red-500" : "border-gray-200"}
        focus-within:ring-2 focus-within:ring-indigo-500`}
      >
        {icon && <span className="text-gray-400 mr-2">{icon}</span>}

        <input
        type={type}
          className={`w-full outline-none text-sm bg-transparent ${inputClassName}`}
          {...props}
        />
      </div>

      {/* Error text */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

export default Input;
