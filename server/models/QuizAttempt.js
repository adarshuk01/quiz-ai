const mongoose = require("mongoose");

const AttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    studentName: String,
    rollNo: { type: String, required: true },

    attemptToken: {
      type: String,
      unique: true,
    },

    expiresAt: Date,

    answers: [
      {
        questionIndex: Number,
        selectedOption: Number,
      },
    ],

    score: Number,

    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent multiple attempts per roll number
AttemptSchema.index({ quiz: 1, rollNo: 1 }, { unique: true });

module.exports = mongoose.model("QuizAttempt", AttemptSchema);
