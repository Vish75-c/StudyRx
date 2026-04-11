import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  userAnswer: { type: String, default: "" },
  correctAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String, default: "" },
});

const attemptSchema = new mongoose.Schema({
  answers: [answerSchema],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade: { type: String, required: true },
  timeTaken: { type: Number, default: 0 },
  attemptedAt: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: mongoose.Schema.Types.Mixed, required: true },
  correctAnswer: { type: String, required: true },
  topic: { type: String, default: "General" },
});

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    title: { type: String, default: "Quiz" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questions: [questionSchema],
    attempts: [attemptSchema],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
