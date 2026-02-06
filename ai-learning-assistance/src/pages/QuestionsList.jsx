import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    getQuestionSetById(id);
  }, [id]);

  useEffect(() => {
    if (currentQuestionSet) {
      setQuestions(currentQuestionSet.questions);
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

  // actual save logic
  const confirmSave = async () => {
    try {
      setSaving(true);
      setShowSaveConfirm(false);

      await axiosInstance.put(`/questionsets/${id}`, {
        questions,
      });

      alert("Question set updated successfully");
      getQuestionSetById(id);
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
    <div className="mx-auto space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold capitalize text-gray-800">
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
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            onClick={() => navigate("/question-sets/create-topic")}
            icon={<FaWandMagicSparkles />}
          >
            Create Quiz
          </Button>
        </div>
      </div>

      {/* Editable questions */}
      <div className="space-y-4 lg:h-125 h-full overflow-y-auto">
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

      {/* Save Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSaveConfirm}
        title="Save Changes?"
        message="Are you sure you want to save the updated questions?"
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={confirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
}

export default QuestionSetDetails;
