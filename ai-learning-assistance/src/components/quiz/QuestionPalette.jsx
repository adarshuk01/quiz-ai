import React from "react";

function QuestionPalette({
  total,
  currentIndex,
  answers,
  onNavigate,
}) {
  return (
    <div className="bg-white p-4 border-l border-gray-300 h-full">
      <h3 className="font-semibold text-gray-800 mb-1">
        Question Palette
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Navigate to any question instantly
      </p>

      <div className="grid grid-cols-5 lg:grid-cols-8 gap-2 mb-6">
        {Array.from({ length: total }).map((_, i) => {
          const isCurrent = i === currentIndex;
          const attempted = answers[i] !== undefined;

          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`h-10 rounded-md text-sm font-medium
                ${
                  isCurrent
                    ? "bg-indigo-600 text-white"
                    : attempted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500 rounded"></span>
          Attempted
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-indigo-600 rounded"></span>
          Current
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-300 rounded"></span>
          Not Answered
        </div>
      </div>

    
    </div>
  );
}

export default QuestionPalette;
