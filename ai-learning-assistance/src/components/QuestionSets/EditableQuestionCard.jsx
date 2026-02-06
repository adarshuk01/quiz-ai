import React from "react";
import { FiTrash2, FiMove } from "react-icons/fi";

function EditableQuestionCard({ index, question, onChange, onDelete }) {
  const handleQuestionChange = (e) => {
    onChange(index, {
      ...question,
      question: e.target.value,
    });
  };

  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = value;

    onChange(index, {
      ...question,
      options: newOptions,
    });
  };

  const handleCorrectChange = (optIndex) => {
    onChange(index, {
      ...question,
      correctAnswer: optIndex,
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <FiMove className="text-gray-400" />
          <h3 className="font-semibold text-gray-800">
            Question {index + 1}
          </h3>
        </div>

        <button
          onClick={() => onDelete(index)}
          className="text-gray-400 hover:text-red-500"
        >
          <FiTrash2 />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Question text */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Question Text
          </label>
          <textarea
            value={question.question}
            onChange={handleQuestionChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
          />
        </div>

        {/* Options */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Answer Options
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Select the radio button to mark the correct answer.
          </p>

          <div className="space-y-2">
            {question.options.map((opt, i) => {
              const isCorrect = i === question.correctAnswer;

              return (
                <label
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm cursor-pointer
                  ${
                    isCorrect
                      ? "bg-green-50 border-green-400"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={isCorrect}
                    onChange={() => handleCorrectChange(i)}
                  />

                  <input
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(i, e.target.value)
                    }
                    className="flex-1 bg-transparent outline-none"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditableQuestionCard;
