import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 text-red-500 p-3 rounded-full">
            <FiAlertTriangle size={28} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-sm mt-2 text-center leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
