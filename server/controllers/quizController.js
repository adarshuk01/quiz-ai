const Quiz = require("../models/Quiz");
const crypto = require("crypto");
const QuestionSet = require("../models/QuestionSet");
const QuizAttempt = require("../models/QuizAttempt");
require("dotenv").config();


exports.createQuiz = async (req, res) => {
  const { title, questionSetId, duration, autoPauseAt } = req.body;

  const accessCode = crypto.randomBytes(4).toString("hex");

  const quiz = await Quiz.create({
    title,
    questionSet: questionSetId,
    duration,
    accessCode,
    createdBy: req.user._id,
    autoPauseAt: autoPauseAt || null,
  });

  const link = `${process.env.FRONTEND_URL}/quiz/${accessCode}`;

  res.status(201).json({
    quiz,
    link,
  });
};


exports.setQuizPauseState = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { isPaused } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { isPaused },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({
        message: "QUIZ_NOT_FOUND",
      });
    }

    res.json({
      message: isPaused ? "QUIZ_PAUSED" : "QUIZ_RESUMED",
      isPaused: quiz.isPaused,
      quiz,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "FAILED_TO_UPDATE_PAUSE_STATE",
    });
  }
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
    const { title, questionSetId, duration,autoPauseAt  } = req.body;

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
        if (autoPauseAt !== undefined) quiz.autoPauseAt = autoPauseAt;


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


exports.getQuizResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        message: "ATTEMPT_NOT_FOUND",
      });
    }

    if (!attempt.isSubmitted) {
      return res.status(400).json({
        message: "QUIZ_NOT_SUBMITTED",
      });
    }

    const total = attempt.answers.length;
    const correct = attempt.score;
    const incorrect = attempt.incorrect || 0;
    const notAttempted = attempt.notAttempted || 0;

    const percentage =
      total > 0 ? Math.round((correct / total) * 100) : 0;

    res.json({
      percentage,
      correct,
      incorrect,
      notAttempted,
      total,
    });
  } catch (err) {
    console.error("GET RESULT ERROR:", err);
    res.status(500).json({
      message: "FAILED_TO_GET_RESULT",
    });
  }
};



exports.startQuiz = async (req, res) => {
  try {
    const { code } = req.params;
    const { studentName, rollNo } = req.body;

    const quiz = await Quiz.findOne({ accessCode: code })
      .populate("questionSet");

    if (!quiz) {
      return res.status(404).json({ message: "QUIZ_NOT_FOUND" });
    }

    // Check scheduled auto pause
    if (quiz.autoPauseAt && new Date() >= quiz.autoPauseAt) {
      return res.status(403).json({ message: "QUIZ_AUTO_PAUSED" });
    }

    // 🔴 Check if quiz is paused
    if (quiz.isPaused) {
      return res.status(403).json({
        message: "QUIZ_PAUSED",
      });
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
      expiresAt,
    });
  } catch (err) {
    console.error("START QUIZ ERROR:", err);
    res.status(500).json({
      message: "FAILED_TO_START_QUIZ",
    });
  }
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
    questions: quiz.questionSet.questions,
  });
};

exports.submitQuiz = async (req, res) => {
  const { code } = req.params;
  const { attemptToken, answers = [] } = req.body;

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
       attemptId: attempt._id,
    });
  }

  const questions = quiz.questionSet.questions;

  let score = 0;
  let incorrect = 0;
  let notAttempted = 0;

  // Build detailed results
  const detailedResults = questions.map((q, index) => {
    const answer = answers.find(
      (a) => a.questionIndex === index
    );

    // Not attempted
    if (!answer) {
      notAttempted++;
      incorrect++;

      return {
        questionIndex: index,
        selectedOption: null,
        isCorrect: false,
        status: "not_attempted",
      };
    }

    // Correct
    if (answer.selectedOption === q.correctAnswer) {
      score++;

      return {
        questionIndex: index,
        selectedOption: answer.selectedOption,
        isCorrect: true,
        status: "correct",
      };
    }

    // Incorrect
    incorrect++;

    return {
      questionIndex: index,
      selectedOption: answer.selectedOption,
      isCorrect: false,
      status: "incorrect",
    };
  });

  // Save attempt
  attempt.answers = detailedResults;
  attempt.score = score;
  attempt.incorrect = incorrect;
  attempt.notAttempted = notAttempted;
  attempt.isSubmitted = true;
  attempt.submittedAt = new Date();

  await attempt.save();

  res.json({
    attemptId: attempt._id,
    score,
    incorrect,
    notAttempted,
    total: questions.length,
  });
};


// GET /api/quiz/analytics/:quizId
// GET /api/quiz/analytics/:quizId
exports.getQuizAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params;

    const attempts = await QuizAttempt.find({
      quiz: quizId,
      isSubmitted: true,
    })
      .populate("quiz") // populate quiz details
      .sort({ submittedAt: -1 });

    if (!attempts.length) {
      return res.status(200).json({
        quiz: null,
        totalParticipants: 0,
        averageScore: 0,
        averagePercentage: 0,
        students: [],
      });
    }

    const quiz = attempts[0].quiz;

    const totalQuestions = quiz.questions
      ? quiz.questions.length
      : attempts[0].answers.length;

    let totalScore = 0;

    const students = attempts.map((attempt) => {
      const correct = attempt.answers.filter(
        (a) => a.status === "correct"
      ).length;

      const incorrect = attempt.answers.filter(
        (a) => a.status === "incorrect"
      ).length;

      const notAttempted = attempt.answers.filter(
        (a) => a.status === "not_attempted"
      ).length;

      const score = attempt.score || correct;
      totalScore += score;

      const percentage =
        totalQuestions > 0
          ? ((score / totalQuestions) * 100).toFixed(2)
          : 0;

      // time taken in seconds
      let timeTaken = null;
      if (attempt.createdAt && attempt.submittedAt) {
        timeTaken =
          (new Date(attempt.submittedAt) - new Date(attempt.createdAt)) /
          1000;
      }

      

      return {
        studentName: attempt.studentName,
        rollNo: attempt.rollNo,
        correct,
        incorrect,
        notAttempted,
        score,
        percentage: Number(percentage),
        submittedAt: attempt.submittedAt,
        timeTakenSeconds: timeTaken,
      };
    });

    
    // 🔹 Sort students by highest percentage
    students.sort((a, b) => b.percentage - a.percentage);

    const averageScore = totalScore / attempts.length;
    const averagePercentage =
      totalQuestions > 0
        ? ((averageScore / totalQuestions) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      quiz: {
        title: quiz.title,
        createdAt: quiz.createdAt,
        totalQuestions,
        duration: quiz.duration,
      },
      totalParticipants: attempts.length,
      averageScore: Number(averageScore.toFixed(2)),
      averagePercentage: Number(averagePercentage),
      students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





exports.getAttemptReview = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // 1️⃣ Get attempt
    const attempt = await QuizAttempt.findById(attemptId).populate("quiz");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    console.log(attempt);
    

    // 2️⃣ Get Question Set (assuming quiz refers to QuestionSet)
    const questionSet = await QuestionSet.findById(attempt.quiz.questionSet);

    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    const result = questionSet.questions.map((question, index) => {
      const userAnswer = attempt.answers.find(
        (ans) => ans.questionIndex === index
      );

      const selectedOption = userAnswer?.selectedOption ?? null;
      const correctAnswer = question.correctAnswer;

      let status = "not_attempted";

      if (selectedOption === null) {
        status = "not_attempted";
      } else if (selectedOption === correctAnswer) {
        status = "correct";
      } else {
        status = "incorrect";
      }

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        selectedOption,
        correctAnswer,
        status,
      };
    });

    return res.status(200).json({
      success: true,
      student: attempt.studentName,
      rollNo: attempt.rollNo,
      score: attempt.score,
      review: result,
    });
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

