const Quiz = require("../models/Quiz");
const crypto = require("crypto");
const QuestionSet = require("../models/QuestionSet");
const QuizAttempt = require("../models/QuizAttempt");

exports.createQuiz = async (req, res) => {
  const { title, questionSetId, duration } = req.body;

  const accessCode = crypto.randomBytes(4).toString("hex");

  const quiz = await Quiz.create({
    title,
    questionSet: questionSetId,
    duration,
    accessCode,
    createdBy: req.user._id,
  });

  const link = `${process.env.FRONTEND_URL}/quiz/${accessCode}`;

  res.status(201).json({
    quiz,
    link,
  });
};


exports.getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .populate("questionSet", "topic") // optional: shows question set title
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error("GET USER QUIZZES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).populate("questionSet");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("GET QUIZ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { title, questionSetId, duration } = req.body;

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (title !== undefined) quiz.title = title;
    if (questionSetId !== undefined) quiz.questionSet = questionSetId;
    if (duration !== undefined) quiz.duration = duration;

    await quiz.save();

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    console.error("UPDATE QUIZ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("DELETE QUIZ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.startQuiz = async (req, res) => {
  const { code } = req.params;
  const { studentName, rollNo } = req.body;

  const quiz = await Quiz.findOne({ accessCode: code })
    .populate("questionSet");

  if (!quiz) {
    return res.status(404).json({ message: "QUIZ_NOT_FOUND" });
  }

  // Check existing attempt
  const existingAttempt = await QuizAttempt.findOne({
    quiz: quiz._id,
    rollNo,
  });

  if (existingAttempt) {
    return res.status(400).json({
      message: "ALREADY_ATTEMPTED",
    });
  }

  // Generate token
  const attemptToken = crypto.randomBytes(16).toString("hex");

  // Expiry based on quiz duration
  const expiresAt = new Date(
    Date.now() + quiz.duration * 60 * 1000
  );

  // Create attempt
  await QuizAttempt.create({
    quiz: quiz._id,
    studentName,
    rollNo,
    attemptToken,
    expiresAt,
  });

 // Remove correctAnswer before sending
const safeQuestions = quiz.questionSet.questions.map((q, index) => ({
  questionIndex: index,
  question: q.question,
  options: q.options,
}));

res.json({
  title: quiz.title,
  duration: quiz.duration,
  attemptToken,
  questions: safeQuestions,
});

};


exports.getQuizByCode = async (req, res) => {
  const { code } = req.params;

  const quiz = await Quiz.findOne({ accessCode: code })
    .populate("questionSet");

  if (!quiz) {
    return res.status(404).json({ message: "QUIZ_NOT_FOUND" });
  }

  res.json({
    title: quiz.title,
    duration: quiz.duration,
    questions: quiz.questionSet.questions.length,
  });
};

exports.submitQuiz = async (req, res) => {
  const { code } = req.params;
  const { attemptToken, answers } = req.body;

  if (!attemptToken) {
    return res.status(400).json({
      message: "TOKEN_REQUIRED",
    });
  }

  const quiz = await Quiz.findOne({ accessCode: code })
    .populate("questionSet");

  if (!quiz) {
    return res.status(404).json({ message: "QUIZ_NOT_FOUND" });
  }

  const attempt = await QuizAttempt.findOne({
    attemptToken,
    quiz: quiz._id,
  });

  if (!attempt) {
    return res.status(400).json({
      message: "INVALID_TOKEN",
    });
  }

  if (attempt.isSubmitted) {
    return res.status(400).json({
      message: "ALREADY_SUBMITTED",
    });
  }

  if (attempt.expiresAt < new Date()) {
    return res.status(400).json({
      message: "TIME_EXPIRED",
    });
  }

  // Calculate score
  let score = 0;

  quiz.questionSet.questions.forEach((q, index) => {
    const answer = answers.find(a => a.questionIndex === index);

    if (answer && answer.selectedOption === q.correctAnswer) {
      score++;
    }
  });

  attempt.answers = answers;
  attempt.score = score;
  attempt.isSubmitted = true;
  await attempt.save();

  res.json({
    score,
    total: quiz.questionSet.questions.length,
  });
};
