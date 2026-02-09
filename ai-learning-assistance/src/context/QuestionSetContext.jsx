import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuestionSetContext = createContext();

export const useQuestionSets = () => useContext(QuestionSetContext);

export const QuestionSetProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate=useNavigate()

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
      navigate('/question-sets')
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

   const generateQuestionsManually = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post(
        "/questionsets/generate-manual",
        formData
      );

      console.log(res.data);
      

      setGeneratedQuestions(res.data.questions || []);
      navigate(`/question-sets/${res.data.questionSetId}`)
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

   // 🔹 Generate questions
  const generateQuestionsFromPdf = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post(
        "/questionsets/upload",
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

  const deleteQuestionSet = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await axiosInstance.delete(`/questionsets/${id}`);
      setQuestionSets((prev) =>
  prev.filter((q) => q._id !== id)
);

    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete");
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
        generateQuestionsFromPdf,
        generateQuestions,
        getMyQuestionSets,
        getQuestionSetById,
        deleteQuestionSet,
        generateQuestionsManually

      }}
    >
      {children}
    </QuestionSetContext.Provider>
  );
};
export const useQuestionSet = () => useContext(QuestionSetContext);

