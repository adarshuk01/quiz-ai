import React, { useEffect, useState } from "react";
import { BiQuestionMark } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";
import { CiCircleQuestion } from "react-icons/ci";
import { FiSearch, FiClock, FiUser, FiFilter } from "react-icons/fi";


function QuizSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-300 p-5 animate-pulse">

      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>

      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>

      <div className="h-9 bg-gray-200 rounded"></div>

    </div>
  );
}

function Explore() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://quiz-ai-orpin.vercel.app/api/quiz/public/explore?search=${debouncedSearch}&sort=${sort}&page=${page}`
      );

      const data = await res.json();
      console.log(data);
      

      setQuizzes(data.quizzes);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [debouncedSearch, sort, page]);

  return (
      <div className="">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h1 className="text-2xl font-bold text-gray-800">
            Explore Quizzes
          </h1>

          {/* SEARCH */}
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80">
            <FiSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search quizzes..."
              className="ml-2 outline-none w-full"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

        </div>

        {/* SORT */}
        <div className="flex items-center gap-3 mb-6">

          <div className="flex items-center gap-2 text-gray-600">
            <FiFilter />
            <span className="text-sm">Sort</span>
          </div>

          <select
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title</option>
          </select>

        </div>

        {/* QUIZ GRID */}
        {loading ? (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {[...Array(3)].map((_, i) => (
      <QuizSkeleton key={i} />
    ))}
  </div>
) : quizzes?.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No quizzes found
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-xl border border-gray-300 hover:shadow-md transition p-5 flex flex-col justify-between"
              >

                <div>

                  <h2 className="font-semibold text-lg text-gray-800 mb-1">
                    {quiz.title}
                  </h2>

                  <p className="text-sm text-gray-500 mb-3">
                    {quiz.questionSet?.topic}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 gap-4">

                    <div className="flex items-center gap-1">
                      <FiClock />
                      {quiz.duration} min
                    </div>

                    <div className="flex items-center gap-1">
                      <FiUser />
                      {quiz.createdBy?.firstName} {quiz.createdBy?.lastName}
                    </div>
                     <div className="flex items-center gap-1">
                      <BsQuestionCircle />
                      {quiz.questionCount}
                    </div>

                  </div>

                </div>

                <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm">
                  Start Quiz
                </button>

              </div>
            ))}

          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-1 text-sm text-gray-600">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>

          </div>
        )}

      </div>
  );
}

export default Explore;