import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle, FiAward } from "react-icons/fi";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function QuizResult() {
  const { id } = useParams(); // attemptId
  const navigate = useNavigate();

  const [result, setResult] = useState({
    score: 0,
    correct: 0,
    incorrect: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axiosInstance.get(
          `/quiz/result/${id}`
        );
          console.log(res);

        setResult(res.data);
      } catch (err) {
        console.error("Failed to fetch result:", err);
      } finally {
        setLoading(false);
      }
    };

  
    

    if (id) fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white px-6 py-4 rounded-lg shadow">
          Loading result...
        </div>
      </div>
    );
  }

  const { score, correct, incorrect, total } = result;
  const percentage = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        {/* Trophy icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 text-green-600 p-4 rounded-full">
            <FiAward size={28} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Quiz Completed!
        </h2>
        <p className="text-gray-500 mt-2">
          You've successfully finished the assessment.
        </p>

        {/* Score circle */}
        <div className="flex justify-center my-6">
          <div className="relative w-36 h-36 rounded-full border-8 border-indigo-600 flex items-center justify-center">
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {percentage}%
              </p>
              <p className="text-sm text-gray-500">
                {correct}/{total} Correct
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">CORRECT</p>
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-lg">
              <FiCheckCircle />
              {correct}
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">INCORRECT</p>
            <div className="flex items-center justify-center gap-2 text-red-500 font-semibold text-lg">
              <FiXCircle />
              {incorrect}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/quizresult/${id}/answers`)}
            className="w-full border rounded-lg py-3 text-gray-700 hover:bg-gray-100"
          >
            View Detailed Answers
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium"
          >
            Exit to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;
