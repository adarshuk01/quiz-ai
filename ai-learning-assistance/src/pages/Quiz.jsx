import React, { useEffect, useState } from "react";
import QuizHeader from "../components/common/QuizHeader";
import Button from "../components/common/Button";
import { FaClipboardQuestion, FaEye, FaTrash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { useQuiz } from "../context/QuizContext";
import { FaEdit, FaPlayCircle } from "react-icons/fa";

function Quiz() {
  const navigate = useNavigate();
  const { quizzes, fetchQuizzes, deleteQuiz,toggleQuizPause, loading } = useQuiz();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (!confirmDelete) return;

    try {
      await deleteQuiz(id);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Title",
      render: (row) => (<Link className="capitalize text-blue-600 hover:underline" to={`/quizdetails/${row._id}`}>{row.title}</Link>),    },
    {
      header: "Question Set",
      render: (row) => row.questionSet?.topic || "-",
    },
    {
      header: "Duration",
      render: (row) => `${row.duration} mins`,
    },
    {
      header: "Access Code",
      accessor: "accessCode",
    },
    {
  header: "Actions",
  render: (row) => (
    <div className="flex flex-col gap-2 text-sm text-gray-500">
      <div className="flex gap-3">
        {/* View */}
        <button
          onClick={() =>
            window.open(`/startquiz/${row.accessCode}`, "_blank")
          }
          className="hover:underline flex items-center gap-1"
        >
          <FaPlayCircle /> Demo
        </button>

        {/* Edit */}
        <button
          onClick={() => navigate(`/quizzes/edit/${row._id}`)}
          className="hover:underline flex items-center gap-1"
        >
          <FaEdit /> Edit
        </button>

        {/* Delete */}
        <button
          onClick={() => handleDelete(row._id)}
          className="text-red-600 hover:underline flex items-center gap-1"
        >
          <FaTrash /> Delete
        </button>

        {/* Pause / Resume */}
        <button
          onClick={async () => {
            try {
              const newState = await toggleQuizPause(row._id, row.isPaused);
              alert(
                `Quiz ${newState ? "paused" : "resumed"} successfully`
              );
            } catch (err) {
              alert("Failed to update pause state");
            }
          }}
          className={`px-2 py-1 rounded ${
            row.isPaused ? "bg-green-600 text-white" : "bg-yellow-500 text-white"
          }`}
        >
          {row.isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      {/* Copy link button */}
      <button
        onClick={() =>
          navigator.clipboard.writeText(
            `${window.location.origin}/quiz/${row.accessCode}`
          )
        }
        className="text-indigo-600 hover:underline text-xs self-start"
      >
        Copy quiz link
      </button>
    </div>
  ),
},

  ];

  return (
    <div>
      <QuizHeader
        title={"My Quizzes"}
        actions={
          <Button
            onClick={() => navigate("/quizzes/create")}
            icon={<FaClipboardQuestion />}
          >
            Create Quiz
          </Button>
        }
      />

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={filteredData}
          searchValue={search}
          onSearch={setSearch}
          loading={loading}   // ← pulse loading applied
        />
      </div>
    </div>
  );
}

export default Quiz;
