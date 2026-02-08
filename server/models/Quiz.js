const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    questionSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionSet",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    duration: {
      type: Number, // in minutes
      required: true,
    },

    accessCode: {
      type: String,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // NEW FIELDS
    isPaused: {
      type: Boolean,
      default: false,
    },

    autoPauseAt: {
      type: Date, // scheduled pause time
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", QuizSchema);
