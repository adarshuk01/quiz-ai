import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import { FiRotateCcw } from "react-icons/fi";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import Breadcrumb from "../common/Breadcrumb";
import { useQuestionSet } from "../../context/QuestionSetContext";

function QuestionSetForm() {
  const {
    generateQuestions,
    generateQuestionsManually,
    loading,
  } = useQuestionSet();

  const [form, setForm] = useState({
    topic: "",
    difficulty: "medium",
    count: 15,
    instructions: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleReset = () => {
    setForm({
      topic: "",
      difficulty: "medium",
      count: 15,
      instructions: "",
    });
    setErrors({});
  };

  // 🔹 Validation
  const validate = () => {
    const newErrors = {};

    if (!form.topic.trim()) {
      newErrors.topic = "Topic is required";
    }

    if (!form.count || form.count < 5 || form.count > 50) {
      newErrors.count = "Must be between 5 and 50";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 AI Generate
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await generateQuestions(form);
      console.log("AI questions generated");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Manual Generate
  const handleManualGenerate = async () => {
    if (!validate()) return;

    try {
      await generateQuestionsManually(form);
      console.log("Manual question set created");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Question Sets", path: "/question-sets" },
          { label: "Create Questions" },
        ]}
      />

      <div className="max-w-2xl mx-auto mt-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Generation settings
              </h2>
              <p className="text-sm text-gray-500">
                Describe what you want and we will generate it for you.
              </p>
            </div>

            <span className="text-xs text-nowrap font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-600">
              AI powered
            </span>
          </div>

          {/* Topic */}
          <Input
            label="Topic name"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            placeholder="e.g. Photosynthesis in plants"
            error={errors.topic}
          />

          {/* Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              options={[
                { label: "Easy", value: "easy" },
                { label: "Medium", value: "medium" },
                { label: "Hard", value: "hard" },
              ]}
            />

            <Input
              label="Number of questions"
              type="number"
              name="count"
              value={form.count}
              onChange={handleChange}
              error={errors.count}
              min={5}
              max={50}
            />
          </div>

          {/* Instructions */}
          <Textarea
            label="Additional instructions (optional)"
            name="instructions"
            rows={4}
            value={form.instructions}
            onChange={handleChange}
          />

          {/* Footer */}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              icon={<FiRotateCcw />}
              onClick={handleReset}
            >
              Reset
            </Button>

            {/* Manual Generate */}
            <Button
              type="button"
              variant="secondary"
              icon={<FiEdit3 />}
              onClick={handleManualGenerate}
              loading={loading}
            >
              Manual
            </Button>

            {/* AI Generate */}
            <Button
              type="submit"
              icon={<FaWandMagicSparkles />}
              loading={loading}
            >
              Generate
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default QuestionSetForm;
