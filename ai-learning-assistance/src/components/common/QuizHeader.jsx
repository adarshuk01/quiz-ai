import React from "react";

function QuizHeader({
  title,
  createdAt,
  duration,
  questions,
  actions, // custom action elements
}) {
  return (
    <div className="flex flex-wrap justify-between md:flex-row md:items-center md:justify-between gap-4">
      {/* Left section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        {/* <p className="text-sm text-gray-500 mt-1">
          Created on {createdAt} • {duration} • {questions} Questions
        </p> */}
      </div>

      {/* Right actions */}
      {actions && (
        <div className="flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

export default QuizHeader;
