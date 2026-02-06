const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const QuestionSetSchema = new mongoose.Schema(
  {
    sourceFile: String,
    topic: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [QuizQuestionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionSet", QuestionSetSchema);
