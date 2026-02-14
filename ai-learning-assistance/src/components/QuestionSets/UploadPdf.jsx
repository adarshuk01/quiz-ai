import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { FiUploadCloud } from "react-icons/fi";
import { FaWandMagicSparkles } from "react-icons/fa6";
import Breadcrumb from "../common/Breadcrumb";
import { useQuestionSets } from "../../context/QuestionSetContext";

function UploadPdf() {
  const [form, setForm] = useState({
    topic: "",
    questions: 10,
    difficulty: "medium",
    file: null,
  });

  const { generateQuestionsFromPdf, loading } = useQuestionSets();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.file) {
    alert("Please upload a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", form.file); // ✅ FIXED
  formData.append("topic", form.topic);
  formData.append("questions", form.questions);
  formData.append("difficulty", form.difficulty);

  await generateQuestionsFromPdf(formData);
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
          className="bg-white rounded-2xl shadow-md p-6 space-y-6"
        >
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Upload Study Material
            </h2>
            <p className="text-sm text-gray-500">
              Upload a PDF, DOCX, or TXT file. Our AI will analyze the content
              and generate high-quality questions for you.
            </p>
          </div>

          {/* Upload area */}
          <label className="block">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition">
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
                  <FiUploadCloud />
                </div>
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PDF up to 10MB
                </p>

                {/* Show selected file */}
                {form.file && (
                  <p className="text-sm text-indigo-600 font-medium mt-2">
                    Selected: {form.file.name}
                  </p>
                )}
              </div>
            </div>

            <input
              type="file"
              name="file"
               accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleChange}
            />
          </label>

          {/* Topic */}
          <Input
            label="Topic Name"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            placeholder="Biology Chapter 4"
          />

          {/* Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Number of Questions"
              type="number"
              name="questions"
              value={form.questions}
              onChange={handleChange}
            />

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
          </div>

          {/* Submit */}
          <Button
            type="submit"
            loading={loading}
            icon={<FaWandMagicSparkles />}
            className="w-full justify-center"
            disabled={loading}
          >
            Generate Questions
          </Button>
        </form>
      </div>
    </>
  );
}

export default UploadPdf;
