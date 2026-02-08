import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import QuizHeader from "../components/quiz/QuizHeader";
import QuestionCard from "../components/quiz/QuestionCard";
import QuestionPalette from "../components/quiz/QuestionPalette";
import { FiGrid } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";

function QuizPage() {
  const navigate = useNavigate();
  const { code, token } = useParams();

  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const [paletteOpen, setPaletteOpen] = useState(false);

  // timer states
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef(null);

  // format mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // fetch quiz questions and load backend timer
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosInstance.get(
          `/quiz/code/${code}`
        );

        setQuestions(res.data.questions || []);
        setQuizTitle(res.data.title);

        // load end time from localStorage
        const storageKey = `quiz_end_${token}`;
        const savedEnd = localStorage.getItem(storageKey);

        if (!savedEnd) {
          alert("Session expired. Please start the quiz again.");
          navigate("/");
          return;
        }

        const remaining = Math.max(
          0,
          Math.floor((Number(savedEnd) - Date.now()) / 1000)
        );

        setTimeLeft(remaining);
      } catch (err) {
        console.error("Failed to load quiz", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [code, token, navigate]);

  // timer logic based on backend expiry
  useEffect(() => {
    if (submitted) return;

    const storageKey = `quiz_end_${token}`;

    timerRef.current = setInterval(() => {
      const endTime = Number(localStorage.getItem(storageKey));

      if (!endTime) return;

      const remaining = Math.max(
        0,
        Math.floor((endTime - Date.now()) / 1000)
      );

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleSubmit(true);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [submitted, token]);

const handleSelect = (optionIndex) => {
  const updated = { ...answersRef.current, [current]: optionIndex };

  answersRef.current = updated;
  setAnswers(updated);
};


 const handleSubmit = async (auto = false) => {
  if (submitted) return;
  setSubmitted(true);
  clearInterval(timerRef.current);

  try {
    const liveAnswers = answersRef.current;

    const formattedAnswers = Object.keys(liveAnswers).map((key) => ({
      questionIndex: Number(key),
      selectedOption: liveAnswers[key],
    }));

    const res = await axiosInstance.post(
      `/quiz/${code}/submit`,
      {
        attemptToken: token,
        answers: formattedAnswers,
      }
    );

    localStorage.removeItem(`quiz_end_${token}`);

   navigate(`/quizresult/${res.data.attemptId}`);

  } catch (err) {
    console.error("Submit failed", err.message);
    console.log(err.response?.data);

    if (err.response?.data?.message === "TIME_EXPIRED") {
         navigate(`/quizresult/${res.data.attemptId}`);

    } else {
      alert("Failed to submit quiz");
    }
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading questions...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">No questions found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <QuizHeader
        title={quizTitle}
        section="Quiz Section"
        time={formatTime(timeLeft)}
      />

      <div className="flex flex-1">
        {/* Main question area */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <QuestionCard
            question={questions[current].question}
            options={questions[current].options}
            selected={answers[current]}
            onSelect={handleSelect}
            current={current + 1}
            total={questions.length}
          />

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6 gap-3">
            <button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="px-5 py-2 border rounded-lg text-gray-600 disabled:opacity-50 w-1/2"
            >
              Previous
            </button>

            {current === questions.length - 1 ? (
              <button
                onClick={() => handleSubmit(false)}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg w-1/2"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrent(Math.min(current + 1, questions.length - 1))
                }
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg w-1/2"
              >
                Next Question
              </button>
            )}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-l bg-white">
          <QuestionPalette
            total={questions.length}
            currentIndex={current}
            answers={answers}
            onNavigate={setCurrent}
            onSubmit={() => handleSubmit(false)}
          />
        </div>
      </div>

      {/* Mobile Floating Toggle Button */}
      <button
        onClick={() => setPaletteOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 bg-indigo-600 text-white p-4 rounded-full shadow-lg"
      >
        <FiGrid size={20} />
      </button>

      {/* Mobile Right Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition ${
          paletteOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setPaletteOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            paletteOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform ${
            paletteOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <QuestionPalette
            total={questions.length}
            currentIndex={current}
            answers={answers}
            onNavigate={(i) => {
              setCurrent(i);
              setPaletteOpen(false);
            }}
            onSubmit={() => handleSubmit(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
