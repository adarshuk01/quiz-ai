const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Get all quiz IDs created by this teacher
    const teacherQuizIds = await Quiz.find({ createdBy: userId })
      .distinct("_id");

    // 2️⃣ Active Quizzes Count
    const activeQuizzes = await Quiz.countDocuments({
      createdBy: userId,
      isActive: true,
    });

    // 3️⃣ Total Students (unique roll numbers for teacher quizzes)
    const totalStudents = await QuizAttempt.distinct("rollNo", {
      quiz: { $in: teacherQuizIds },
    }).then((students) => students.length);

    // 4️⃣ Completion Rate
    const totalAttempts = await QuizAttempt.countDocuments({
      quiz: { $in: teacherQuizIds },
    });

    const submittedAttempts = await QuizAttempt.countDocuments({
      quiz: { $in: teacherQuizIds },
      isSubmitted: true,
    });

    const completionRate =
      totalAttempts === 0
        ? 0
        : Math.round((submittedAttempts / totalAttempts) * 100);

    // 5️⃣ Average Time Per Quiz
    const attempts = await QuizAttempt.find({
      quiz: { $in: teacherQuizIds },
      isSubmitted: true,
      submittedAt: { $ne: null },
    }).select("createdAt submittedAt");

    let totalMinutes = 0;

    attempts.forEach((attempt) => {
      const diff =
        (new Date(attempt.submittedAt) - new Date(attempt.createdAt)) /
        (1000 * 60);
      totalMinutes += diff;
    });

    const avgTimePerQuiz =
      attempts.length === 0
        ? 0
        : Math.round(totalMinutes / attempts.length);

    res.status(200).json({
      activeQuizzes,
      totalStudents,
      completionRate,
      avgTimePerQuiz,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};