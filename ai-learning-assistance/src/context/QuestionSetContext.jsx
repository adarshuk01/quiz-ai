import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const QuestionSetContext = createContext();

export const useQuestionSets = () => useContext(QuestionSetContext);

export const QuestionSetProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [currentQuestionSet, setCurrentQuestionSet] = useState(null); // 🔹 new

  // 🔹 Generate questions
  const generateQuestions = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post(
        "/questionsets/generate",
        formData
      );

      setGeneratedQuestions(res.data.questions || []);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate questions"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get my question sets
  const getMyQuestionSets = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        "/questionsets/my-questions"
      );

      setQuestionSets(res.data || []);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch question sets"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get single question set by ID
  const getQuestionSetById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        `/questionsets/${id}`
      );

      setCurrentQuestionSet(res.data);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch question set"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuestionSetContext.Provider
      value={{
        loading,
        error,
        generatedQuestions,
        questionSets,
        currentQuestionSet,
        generateQuestions,
        getMyQuestionSets,
        getQuestionSetById,

      }}
    >
      {children}
    </QuestionSetContext.Provider>
  );
};
export const useQuestionSet = () => useContext(QuestionSetContext);

