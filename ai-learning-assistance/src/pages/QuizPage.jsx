import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [language, setLanguage] = useState("en");

  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const [paletteOpen, setPaletteOpen] = useState(false);

  // timer states
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef(null);

  const storageAnswersKey = `quiz_answers_${token}`;
  const storageCurrentKey = `quiz_current_${token}`;

  // format mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
  // Prevent loading twice
  if (window.google && window.google.translate) return;

  const addScript = document.createElement("script");
  addScript.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  addScript.async = true;

  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,ml",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  document.body.appendChild(addScript);
}, []);


  // Fetch quiz, load backend timer, answers, and current question
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosInstance.get(`/quiz/code/${code}`);

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

        // Load persisted answers
        const savedAnswers = localStorage.getItem(storageAnswersKey);
        if (savedAnswers) {
          const parsed = JSON.parse(savedAnswers);
          answersRef.current = parsed;
          setAnswers(parsed);
        }

        // Load persisted current question
        const savedCurrent = localStorage.getItem(storageCurrentKey);
        if (savedCurrent) {
          const index = Number(savedCurrent);
          if (index >= 0 && index < res.data.questions.length) {
            setCurrent(index);
          }
        }
      } catch (err) {
        console.error("Failed to load quiz", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [code, token, navigate]);

  // Timer logic
  useEffect(() => {
    if (submitted) return;

    const storageKey = `quiz_end_${token}`;

    timerRef.current = setInterval(() => {
      const endTime = Number(localStorage.getItem(storageKey));

      if (!endTime) return;

      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleSubmit(true);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [submitted, token]);

  // Handle option select
  const handleSelect = (optionIndex) => {
    const updated = { ...answersRef.current, [current]: optionIndex };
    answersRef.current = updated;
    setAnswers(updated);

    // Persist answers
    localStorage.setItem(storageAnswersKey, JSON.stringify(updated));
  };

  // Handle current question change
  const handleSetCurrent = (index) => {
    setCurrent(index);
    localStorage.setItem(storageCurrentKey, index);
  };

  // Handle quiz submission
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

      const res = await axiosInstance.post(`/quiz/${code}/submit`, {
        attemptToken: token,
        answers: formattedAnswers,
      });

      // Clean up localStorage
      localStorage.removeItem(`quiz_end_${token}`);
      localStorage.removeItem(storageAnswersKey);
      localStorage.removeItem(storageCurrentKey);

      navigate(`/quizresult/${res.data.attemptId}`);
    } catch (err) {
      console.error("Submit failed", err.message);
      console.log(err.response?.data);

      if (err.response?.data?.message === "TIME_EXPIRED") {
        const attemptId = err.response.data.attemptId;
        if (attemptId) {
          localStorage.removeItem(`quiz_end_${token}`);
          localStorage.removeItem(storageAnswersKey);
          localStorage.removeItem(storageCurrentKey);
          navigate(`/quizresult/${attemptId}`);
        } else {
          alert("Time expired, but no attemptId received.");
          navigate("/");
        }
      } else {
        alert("Failed to submit quiz");
      }
    }
  };

  const translateText = async (text, targetLang) => {
  if (targetLang === "en") return text;

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    const data = await res.json();
    return data[0].map((item) => item[0]).join("");
  } catch (err) {
    console.error("Translation failed", err);
    return text;
  }
};


const handleLanguageChange = async (lang) => {
  setLanguage(lang);

  if (lang === "en") {
    // Reload original questions
    const res = await axiosInstance.get(`/quiz/code/${code}`);
    setQuestions(res.data.questions || []);
    return;
  }

  // Translate all questions
  const translatedQuestions = await Promise.all(
    questions.map(async (q) => {
      const translatedQuestion = await translateText(q.question, lang);

      const translatedOptions = await Promise.all(
        q.options.map((opt) => translateText(opt, lang))
      );

      return {
        ...q,
        question: translatedQuestion,
        options: translatedOptions,
      };
    })
  );

  setQuestions(translatedQuestions);
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
      {/* Hidden Google Translate Element */}
<div id="google_translate_element" style={{ display: "none" }}></div>
      <QuizHeader title={quizTitle} section={`Question ${current + 1}`} time={formatTime(timeLeft)} />
      <div className="flex justify-end px-6 py-2 bg-white border-b border-gray-300">
        <div className="flex gap-2">
          <h3>Select your language :</h3>
  <select
    value={language}
    onChange={(e) => handleLanguageChange(e.target.value)}
    className="border px-3 py-1 rounded-md text-sm"
  >
    <option value="en">English</option>
    <option value="ml">Malayalam</option>
  </select>
  </div>

  
  
</div>


      <div className=" grid lg:grid-cols-8">
        {/* Main question area */}
        <div className="col-span-5 p-4 md:p-6 lg:p-8">
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
              onClick={() => handleSetCurrent(current - 1)}
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
                onClick={() => handleSetCurrent(Math.min(current + 1, questions.length - 1))}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg w-1/2"
              >
                Next Question
              </button>
            )}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden col-span-3 lg:block   bg-white">
          <QuestionPalette
            total={questions.length}
            currentIndex={current}
            answers={answers}
            onNavigate={handleSetCurrent}
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
        className={`fixed inset-0 z-40 lg:hidden transition ${paletteOpen ? "visible" : "invisible"}`}
      >
        <div
          onClick={() => setPaletteOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${paletteOpen ? "opacity-100" : "opacity-0"}`}
        />

        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform ${paletteOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <QuestionPalette
            total={questions.length}
            currentIndex={current}
            answers={answers}
            onNavigate={(i) => {
              handleSetCurrent(i);
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
