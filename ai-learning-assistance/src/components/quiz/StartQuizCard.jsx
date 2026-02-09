import React, { useEffect, useState } from "react";
import { FaClock, FaArrowRight } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

function StartQuizCard() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosInstance.get(
          `/quiz/code/${code}`
        );
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to load quiz", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [code]);

  const handleStart = async () => {
    if (!name.trim() || !roll.trim()) {
      alert("Please enter name and roll number");
      return;
    }

    try {
      setStarting(true);

      const res= await axiosInstance.post(
        `/quiz/${code}/start`,
        {
          rollNo: roll,
          studentName: name,
        }
      );

      const { attemptToken, expiresAt } = res.data;
      // save in localStorage
   localStorage.setItem(
  `quiz_end_${attemptToken}`,
  new Date(expiresAt).getTime()
);

      // navigate after successful start
      navigate(`/quiz/${code}/attempt/${attemptToken}`, {
        state: { name, roll, quiz },
      });
    } catch (err) {
      console.error("Failed to start quiz", err?.response?.data);
      alert( err?.response?.data?.message);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Quiz not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold">
            ✦
          </div>
          <span className="font-semibold text-gray-800">QuizMind AI</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          {quiz.title}
        </h2>

        {/* Duration */}
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm mb-6">
          <FaClock />
          Duration: {quiz.duration} minutes
        </div>

        {/* Form */}
        <div className="space-y-4 text-left">
          <div>
            <label className="text-sm text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-indigo-400 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Student Roll Number
            </label>
            <input
              type="text"
              placeholder="e.g. 2024-CS-042"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={starting}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-60"
        >
          {starting ? "Starting..." : "Start Quiz Now"}
          {!starting && <FaArrowRight />}
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Please ensure you have a stable internet connection before starting.
        </p>
      </div>
    </div>
  );
}

export default StartQuizCard;
