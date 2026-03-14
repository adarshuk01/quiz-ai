import { FaUsers, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";

function GroupCard({ group, onView, onEdit, onDelete }) {

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 hover:shadow-lg transition">

      {/* TITLE */}

      <div className="flex justify-between border-b border-gray-300 pb-3 mb-4">

        <h2 className="text-xl font-semibold text-gray-800">
          {group.name}
        </h2>

      </div>

      {/* INFO */}

      <div className="flex items-center gap-6 text-gray-500 mb-5">

        <div className="flex items-center gap-2">
          <FaUsers />
          <span>{group.studentCount || 0} Students</span>
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar />
          <span>{formatDate(group.createdAt)}</span>
        </div>

      </div>

      {/* ACTION BUTTONS */}

      <div className="flex gap-2">

        <button
          onClick={onView}
          className="flex-1 bg-gray-100 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
        >
          <FaEye /> View
        </button>

        <button
          onClick={onEdit}
          className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2"
        >
          <FaEdit /> Edit
        </button>

        <button
          onClick={onDelete}
          className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2"
        >
          <FaTrash /> Delete
        </button>

      </div>

    </div>
  );
}

export default GroupCard;