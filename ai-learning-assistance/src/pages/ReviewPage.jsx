import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ReviewCard from "../components/quiz/ReviewCard";

function ReviewPage() {
  const { attemptId } = useParams();
  const [reviewData, setReviewData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // store original English
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axiosInstance.get(
          `quiz/review/${attemptId}`
        );

        setReviewData(res.data.review);
        setOriginalData(res.data.review); // save original
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [attemptId]);

  // Translation function
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
      setReviewData(originalData);
      return;
    }

    const translated = await Promise.all(
      originalData.map(async (item) => {
        const translatedQuestion = await translateText(item.question, lang);

        const translatedOptions = await Promise.all(
          item.options.map((opt) => translateText(opt, lang))
        );

        const translatedCorrect = await translateText(
          item.options[item.correctAnswer],
          lang
        );

        return {
          ...item,
          question: translatedQuestion,
          options: translatedOptions,
          correctAnswer: item.correctAnswer, // index remains same
        };
      })
    );

    setReviewData(translated);
  };

  if (loading) {
    return <div className="p-6">Loading review...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Quiz Review
      </h1>

      {/* Language Selector */}
      <div className="flex justify-end mb-6">
        <div className="flex gap-2 items-center">
          <span>Select Language:</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="en">English</option>
            <option value="ml">Malayalam</option>
          </select>
        </div>
      </div>

      {reviewData.map((item, index) => (
        <ReviewCard
          key={index}
          questionIndex={index}
          total={reviewData.length}
          question={item.question}
          options={item.options}
          selectedOption={item.selectedOption}
          correctAnswer={item.correctAnswer}
        />
      ))}
    </div>
  );
}

export default ReviewPage;
