import React from "react";

function Button({
  children,
  onClick,
  icon,
  variant = "primary",
  className = "",
  loading = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90",
    secondary:
      "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100",
  };

  const disabledStyles =
    "bg-gray-300 text-gray-500 cursor-not-allowed hover:opacity-100";

  return (
    <button
      onClick={onClick}
      disabled={loading || props.disabled}
      className={`${baseStyles} ${
        loading ? disabledStyles : variants[variant]
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="text-base">{icon}</span>
      )}
      {children}
    </button>
  );
}

export default Button;
