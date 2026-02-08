import React from "react";
import { FiClock } from "react-icons/fi";

function QuizHeader({ title, section, time }) {
  return (
    <div className="flex items-center flex-wrap justify-between bg-white px-6 py-4 border-b border-gray-300">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{section}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium">
          <FiClock />
          {time}
        </div>
      </div>
    </div>
  );
}

export default QuizHeader;
