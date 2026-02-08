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

    // UPDATED ANSWER STRUCTURE
    answers: [
      {
        questionIndex: Number,
        selectedOption: {
          type: Number,
          default: null,
        },
        isCorrect: Boolean,
        status: {
          type: String,
          enum: ["correct", "incorrect", "not_attempted"],
        },
      },
    ],

    score: Number,
    incorrect: {
      type: Number,
      default: 0,
    },
    notAttempted: {
      type: Number,
      default: 0,
    },

    isSubmitted: {
      type: Boolean,
      default: false,
    },

    submittedAt: Date,
  },
  { timestamps: true }
);

// Prevent multiple attempts per roll number
AttemptSchema.index({ quiz: 1, rollNo: 1 }, { unique: true });

module.exports = mongoose.model("QuizAttempt", AttemptSchema);
