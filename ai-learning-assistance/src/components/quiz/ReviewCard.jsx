import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

function ReviewCard({
  question,
  options,
  selectedOption,
  correctAnswer,
  questionIndex,
  total,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      {/* Question Header */}
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>
          Question {questionIndex + 1} of {total}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        {question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {options.map((opt, i) => {
          const isCorrect = i === correctAnswer;
          const isSelected = i === selectedOption;

          let style = "border-gray-200 bg-white";

          if (isCorrect) {
            style = "border-green-600 bg-green-50";
          }

          if (isSelected && !isCorrect) {
            style = "border-red-600 bg-red-50";
          }

          return (
            <div
              key={i}
              className={`w-full flex justify-between items-center p-4 rounded-lg border ${style}`}
            >
              <span>{opt}</span>

              {/* Icons */}
              <div>
                {/* Correct Answer */}
                {isCorrect && (
                  <CheckCircle className="text-green-600" size={20} />
                )}

                {/* Wrong Selected */}
                {isSelected && !isCorrect && (
                  <XCircle className="text-red-600" size={20} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Not Attempted */}
      {selectedOption === null && (
        <div className="mt-4 text-yellow-600 text-sm font-medium">
          Not Attempted
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
