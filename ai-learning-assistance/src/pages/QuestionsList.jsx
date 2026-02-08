import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuestionSets } from "../context/QuestionSetContext";
import EditableQuestionCard from "../components/QuestionSets/EditableQuestionCard";
import Button from "../components/common/Button";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import ConfirmDialog from "../components/common/ConfirmDialog";

function QuestionSetDetails() {
  const { id } = useParams();
  const { getQuestionSetById, currentQuestionSet, loading } =
    useQuestionSets();

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // scroll container ref
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    getQuestionSetById(id);
  }, [id]);

  useEffect(() => {
    if (currentQuestionSet) {
      setQuestions(currentQuestionSet.questions || []);
    }
  }, [currentQuestionSet]);

  const handleQuestionChange = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleDelete = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  // Add new question with auto-scroll
  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };

    setQuestions((prev) => {
      const updated = [...prev, newQuestion];

      // wait for DOM render, then scroll
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);

      return updated;
    });
  };

  // actual save logic
  const confirmSave = async () => {
    try {
      setSaving(true);

      await axiosInstance.put(`/questionsets/${id}`, {
        questions,
      });

      await getQuestionSetById(id);
      setShowSaveConfirm(false);
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!currentQuestionSet) return <p className="p-6">No data</p>;

  return (
  <div className="mx-auto lg:h-[calc(95vh-80px)] h-[90vh]  flex flex-col">
    {/* Sticky Header */}
    <div className="sticky top-0 z-10 bg-white shadow-sm p-4 rounded-lg">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="lg:text-2xl text-lg font-semibold capitalize text-gray-800">
            {currentQuestionSet.topic}
          </h2>
          <p className="text-sm text-gray-500">
            {questions.length} questions
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<FaSave />}
            onClick={() => setShowSaveConfirm(true)}
          >
            Save Changes
          </Button>

          <Button
            onClick={() => navigate("/question-sets/create-topic")}
            icon={<FaWandMagicSparkles />}
          >
            Create Quiz
          </Button>
        </div>
      </div>
    </div>

    {/* Scrollable questions area */}
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto space-y-4 p-2"
    >
      {questions.map((q, index) => (
        <EditableQuestionCard
          key={q._id || index}
          index={index}
          question={q}
          onChange={handleQuestionChange}
          onDelete={handleDelete}
        />
      ))}
    </div>

    {/* Add Question button */}
    <div className="flex justify-end p-3 shadow-sm bg-white">
      <Button onClick={handleAddQuestion}>+ Add Question</Button>
    </div>

    {/* Save Confirmation Dialog */}
    <ConfirmDialog
      isOpen={showSaveConfirm}
      loading={saving}
      title="Save Changes?"
      message="Are you sure you want to save the updated questions?"
      confirmText="Save"
      cancelText="Cancel"
      onConfirm={confirmSave}
      onCancel={() => {
        if (!saving) setShowSaveConfirm(false);
      }}
    />
  </div>
);

}

export default QuestionSetDetails;
