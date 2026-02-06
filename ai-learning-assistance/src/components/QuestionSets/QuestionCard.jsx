import React from "react";
import { FiCheckCircle } from "react-icons/fi";

function QuestionCard({ index, question }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-300 bg-gray-50">
        <h3 className="font-semibold text-gray-800">
          Question {index + 1}
        </h3>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
          Multiple Choice
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <p className="text-gray-800 font-medium">
          {question.question}
        </p>

        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctAnswer;

            return (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border border-gray-300 text-sm
                ${
                  isCorrect
                    ? "bg-green-50 border-green-400 text-green-700"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <span>{opt}</span>

                {isCorrect && (
                  <span className="flex items-center gap-1 text-xs font-medium">
                    <FiCheckCircle />
                   
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
