import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📌 Create Quiz
  const createQuiz = async (quizData) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/quiz/create", quizData);

      setQuizzes((prev) => [res.data.quiz, ...prev]);
      return res.data;
    } catch (error) {
      console.error("CREATE QUIZ ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Get all quizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/quiz/my-quizzes");
      setQuizzes(res.data.quizzes);
    } catch (error) {
      console.error("FETCH QUIZZES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Get single quiz
  const getQuizById = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/quiz/${id}`);
      return res.data;
    } catch (error) {
      console.error("GET QUIZ ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Update quiz
  const updateQuiz = async (id, quizData) => {
    try {
      setLoading(true);
      const res = await axiosInstance.put(`/quiz/${id}`, quizData);

      // update local state
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz._id === id ? res.data.quiz : quiz
        )
      );

      return res.data;
    } catch (error) {
      console.error("UPDATE QUIZ ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 📌 Delete quiz
  const deleteQuiz = async (quizId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/quiz/${quizId}`);

      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    } catch (error) {
      console.error("DELETE QUIZ ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        loading,
        createQuiz,
        fetchQuizzes,
        getQuizById,
        updateQuiz,
        deleteQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
