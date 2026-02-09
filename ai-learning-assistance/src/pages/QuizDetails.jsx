import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import {
  FiShare2,
  FiEdit2,
  FiPauseCircle,
  FiTrash2,
} from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";

function QuizDetails() {
  const { quizId } = useParams();
  const [search, setSearch] = useState("");
  const [quizInfo, setQuizInfo] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // format seconds to mm:ss
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get(
          `/quiz/analytics/${quizId}`
        );

        const data = res.data;

        // quiz info (safe defaults)
        setQuizInfo({
          title: data?.quiz?.title || "N/A",
          correct: data?.quiz?.correct,
          incorrect: data?.quiz?.incorrect,
          notAttempted: data?.quiz?.notAttempted,
          date: data?.quiz?.createdAt
            ? new Date(data.quiz.createdAt).toLocaleDateString()
            : "N/A",
          duration: data?.quiz?.duration
            ? `${data.quiz.duration} mins`
            : "N/A",
          totalQuestions: data?.quiz?.totalQuestions || 0,
          totalParticipants: data?.totalParticipants || 0,
          averageScore: data?.averagePercentage || 0,
        });

        // participants
        const mapped = (data.students || []).map((s) => ({
          name: s.studentName,
          rollNo: s.rollNo,
          correct: s.correct,
          incorrect: s.incorrect,
          notAttempted: s.notAttempted,
          dateTaken: s.submittedAt
            ? new Date(s.submittedAt).toLocaleDateString()
            : "--",
          duration: formatTime(s.timeTakenSeconds),
          score: s.percentage,
          status: "completed",
        }));

        setParticipants(mapped);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [quizId]);

  const columns = [
    {
      header: "Student",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium capitalize">{row.name}</span>
          <span className="text-gray-500 text-sm">
            Roll No: {row.rollNo}
          </span>
        </div>
      ),
    },
    { header: "Date Taken", accessor: "dateTaken" },
    { header: "Duration", accessor: "duration" },
    {
      header: "Performance",
      accessor: "performance",
      render: (row) => (
        <div className="text-sm">
          <span className="text-green-600 font-medium">
            Correct: {row.correct}
          </span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-red-500 font-medium">
            Incorrect: {row.incorrect}
          </span> <br />
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-gray-500 font-medium">
            Not Attempted: {row.notAttempted}
          </span>
        </div>
      ),
    },
    {
      header: "Score",
      accessor: "score",
      render: (row) => (
        <span
          className={`px-2 py-1 text-sm rounded-full text-white ${
            row.score >= 90
              ? "bg-green-500"
              : row.score >= 75
              ? "bg-purple-400"
              : "bg-gray-400"
          }`}
        >
          {row.score}%
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: () => (
        <button className="text-gray-400 hover:text-gray-700">
          •••
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="p-6">Loading quiz details...</div>;
  }

  if (!quizInfo) {
    return <div className="p-6">No data found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {quizInfo.title}
          </h1>
          <p className="text-gray-500 text-sm">
            {quizInfo.date} • {quizInfo.duration} •{" "}
            {quizInfo.totalQuestions} Questions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button icon={<FiShare2 />}>Share</Button>
          <Button icon={<FiEdit2 />} variant="secondary">
            Edit
          </Button>
          <Button icon={<FiPauseCircle />} variant="secondary">
            Pause
          </Button>
          <Button icon={<FiTrash2 />} variant="secondary">
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500 text-sm">
            Total Participants
          </p>
          <p className="text-xl font-semibold">
            {quizInfo.totalParticipants}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500 text-sm">
            Average Score
          </p>
          <p className="text-xl font-semibold">
            {quizInfo.averageScore}%
          </p>
        </div>
      </div>

      {/* Table */}
      <div>
        <h2 className="text-lg font-medium mb-3">
          Participants & Scores
        </h2>
        <DataTable
          columns={columns}
          data={participants.filter(
            (p) =>
              p.name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              p.rollNo
                ?.toLowerCase()
                .includes(search.toLowerCase())
          )}
          searchValue={search}
          onSearch={setSearch}
        />
      </div>
    </div>
  );
}

export default QuizDetails;
