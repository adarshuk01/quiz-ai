import React from "react";

function QuestionCard({
  question,
  options,
  selected,
  onSelect,
  current,
  total,
}) {
  const progress = (current / total) * 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Question {current} of {total}
          </span>
          <span>{Math.round(progress)}% completed</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        {question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full text-left p-4 rounded-lg border transition
              ${
                selected === i
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
