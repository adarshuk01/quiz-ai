import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { FiInfo } from "react-icons/fi";
import { useQuestionSets } from "../../context/QuestionSetContext";
import { useQuiz } from "../../context/QuizContext";
import Breadcrumb from "../common/Breadcrumb";

function QuizBasicInfo() {
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 check if edit mode
  const isEditMode = Boolean(id);

  const { questionSets,getMyQuestionSets } = useQuestionSets();
  const { createQuiz, updateQuiz, getQuizById, loading } = useQuiz();

  const [form, setForm] = useState({
    title: "",
    questionSet: "",
    duration: 30,
  });

  const [errors, setErrors] = useState({});

   useEffect(() => {
      getMyQuestionSets();
    }, []);

  // 🔹 Load quiz in edit mode
  useEffect(() => {
    const loadQuiz = async () => {
      if (!isEditMode) return;

      try {
        const quiz = await getQuizById(id);
        setForm({
          title: quiz.title || "",
          questionSet: quiz.questionSet?._id || "",
          duration: quiz.duration || 30,
        });
      } catch (err) {
        console.error("LOAD QUIZ ERROR:", err);
      }
    };

    loadQuiz();
  }, [id, isEditMode]);

  // Transform API data to Select options
  const formattedSets = useMemo(() => {
    const options = questionSets.map((set) => ({
      value: set._id,
      label: set.topic,
      questions: set.questionCount,
      source: set.sourceFile,
    }));

    return [
      {
        value: "",
        label: "Select any question set",
      },
      ...options,
    ];
  }, [questionSets]);

  const selectedSet = formattedSets.find(
    (set) => set.value === form.questionSet && set.questions
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Quiz title is required";
    }

    if (!form.questionSet) {
      newErrors.questionSet = "Please select a question set";
    }

    if (!form.duration || form.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditMode) {
        await updateQuiz(id, {
          title: form.title,
          questionSetId: form.questionSet,
          duration: form.duration,
        });
      } else {
        await createQuiz({
          title: form.title,
          questionSetId: form.questionSet,
          duration: form.duration,
        });
      }

      navigate("/quizzes");
    } catch (err) {
      console.error("QUIZ SUBMIT ERROR:", err);
    }
  };

  const handleCancel = () => {
    navigate("/quizzes");
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Quiz", path: "/quizzes" },
          { label: isEditMode ? "Edit Quiz" : "Create Quiz" },
        ]}
      />

      <div className="max-w-2xl mx-auto mt-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 space-y-6"
        >
          {/* Header */}
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditMode ? "Edit Quiz" : "Create Quiz"}
          </h2>

          {/* Quiz Title */}
          <Input
            label="Quiz Title"
            name="title"
            placeholder="e.g. Molecular Biology Pop Quiz 1"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />

          {/* Question Set */}
          <div>
            <Select
              label="Source Question Set"
              name="questionSet"
              value={form.questionSet}
              onChange={handleChange}
              options={formattedSets}
              error={errors.questionSet}
            />

            {selectedSet && (
              <div className="mt-3 flex gap-3 bg-indigo-50 text-indigo-700 text-sm p-4 rounded-lg border border-indigo-100">
                <FiInfo className="mt-0.5" />
                <p>
                  <strong>
                    {selectedSet.questions} Questions available.
                  </strong>
                  <br />
                  This set was generated from "
                  {selectedSet.source || selectedSet.label}". All{" "}
                  {selectedSet.questions} questions will be included
                  unless you edit the set first.
                </p>
              </div>
            )}
          </div>

          {/* Duration */}
          <Input
            label="Duration (Minutes)"
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            error={errors.duration}
          />

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button type="submit" loading={loading}>
  {isEditMode ? "Update Quiz" : "Create Quiz"}
</Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default QuizBasicInfo;
