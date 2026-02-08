import React, { useEffect, useState } from "react";
import QuizHeader from "../components/common/QuizHeader";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FiFile, FiEye, FiPlay, FiTrash2 } from "react-icons/fi";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import { useQuestionSets } from "../context/QuestionSetContext";
import ConfirmDialog from "../components/common/ConfirmDialog";

function QuestionSets() {
  const navigate = useNavigate();
  const {
    questionSets,
    getMyQuestionSets,
    loading,
    deleteQuestionSet,
  } = useQuestionSets();

  const [search, setSearch] = useState("");

  // confirm dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getMyQuestionSets();
  }, []);

  const filtered = questionSets.filter((q) =>
    q.topic?.toLowerCase().includes(search.toLowerCase())
  );

  const openDeleteDialog = (id) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteQuestionSet(selectedId);
      await getMyQuestionSets(); // refresh list
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setIsConfirmOpen(false);
      setSelectedId(null);
    }
  };

  const columns = [
    {
      header: "Topic",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800 capitalize">
            {row.topic}
          </p>
          {row.source && (
            <p className="text-xs text-gray-500">
              From "{row.source}"
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Questions",
      render: (row) => (
        <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
          {row?.questionCount || 0} Qs
        </span>
      ),
    },
    {
      header: "Created",
      render: (row) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-3 text-gray-500">
          <button onClick={() => navigate(`/question-sets/${row._id}`)}>
            <FiEye />
          </button>
          <button>
            <FiPlay />
          </button>
          <button
            className="text-red-500"
            onClick={() => openDeleteDialog(row._id)}
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <QuizHeader
        title="Question Sets"
        actions={
          <>
            <Button
              onClick={() => navigate("/question-sets/create-topic")}
              icon={<FaWandMagicSparkles />}
            >
              Generate from Topic
            </Button>
            <Button
              onClick={() => navigate("/question-sets/create-pdf")}
              variant="secondary"
              icon={<FiFile />}
            >
              From PDF
            </Button>
          </>
        }
      />

      <div className="mt-6 h-[10%] overflow-scroll">
        <DataTable
          columns={columns}
          data={filtered}
          searchValue={search}
          onSearch={setSearch}
          loading={loading}   // ← pulse loading inside table
        />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Question Set?"
        message="This will permanently remove the question set."
        confirmText={deleting ? "Deleting..." : "Delete"}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}   // ← correct loading state for delete
      />
    </div>
  );
}

export default QuestionSets;
