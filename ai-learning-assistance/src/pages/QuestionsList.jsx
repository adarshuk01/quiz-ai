import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuestionSets } from "../context/QuestionSetContext";
import EditableQuestionCard from "../components/QuestionSets/EditableQuestionCard";
import Button from "../components/common/Button";
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

  // 🔥 ref for scrolling to last question
  const lastQuestionRef = useRef(null);

  useEffect(() => {
    getQuestionSetById(id);
  }, [id]);

  useEffect(() => {
    if (currentQuestionSet) {
      setQuestions(currentQuestionSet.questions || []);
    }
  }, [currentQuestionSet]);

  // 🔥 Auto scroll when new question added
  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [questions.length]);

  const handleQuestionChange = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleDelete = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

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
  <div className="flex flex-col">
    {/* Page Header */}
    <div className="bg-white shadow-sm p-4 rounded-md">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="lg:text-2xl text-lg font-semibold capitalize text-gray-800">
            {currentQuestionSet.topic}
          </h2>
          <p className="text-sm text-gray-500">
            {questions.length} questions
          </p>
        </div>

        <Button
          variant="primary"
          icon={<FaSave />}
          onClick={() => setShowSaveConfirm(true)}
        >
          Save Changes
        </Button>
      </div>
    </div>

    {/* Questions */}
    <div className="space-y-4 mt-4">
      {questions.map((q, index) => (
        <div
          key={q._id || index}
          ref={index === questions.length - 1 ? lastQuestionRef : null}
        >
          <EditableQuestionCard
            index={index}
            question={q}
            onChange={handleQuestionChange}
            onDelete={handleDelete}
          />
        </div>
      ))}
    </div>

    {/* Add Button */}
    <div className="mt-6 flex justify-end">
      <Button onClick={handleAddQuestion}>
        + Add Question
      </Button>
    </div>

    {/* Confirm Dialog */}
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
