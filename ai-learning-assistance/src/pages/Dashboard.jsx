import React from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FiUploadCloud } from "react-icons/fi";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white p-8">
        {/* Background icon */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-[180px]">
          <FaWandMagicSparkles />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-2">
            Generate Quizzes in Seconds
          </h2>
          <p className="text-indigo-100 mb-6">
            Upload a PDF or paste text, and our AI will create a comprehensive
            quiz with multiple choice, short answer, and true/false questions
            instantly.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to={'/question-sets/create-pdf'} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg text-sm font-medium">
              <FiUploadCloud />
              Upload Material
            </Link>

            <Link to={'/question-sets/create-topic'} className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-gray-100 transition px-4 py-2 rounded-lg text-sm font-medium">
              <FaWandMagicSparkles />
              Generate from Topic
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
