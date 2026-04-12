import axios from "axios";
import Quiz from "../models/Quiz.js";
import Collection from "../models/collectionModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const RAG_URL = process.env.RAG_SERVICE_URL;

// POST /api/quiz/generate
export const generateQuiz = async (req, res) => {
  try {
    const { collectionId, numQuestions = 10, difficulty = "medium" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({ message: "Invalid collectionId" });
    }

    // Verify collection belongs to user
    const collection = await Collection.findOne({
      _id: collectionId,
      userId: req.user._id,
    });
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (collection.documentCount === 0) {
      return res
        .status(400)
        .json({ message: "Collection has no documents uploaded" });
    }

    // Call Python RAG service (LLM generation can take 60+ seconds)
    const ragResponse = await axios.post(`${RAG_URL}/quiz/generate`, {
      collection_id: collectionId.toString(),
      num_questions: numQuestions,
      difficulty,
    }, { timeout: 120000 });

    const { questions } = ragResponse.data;

    if (!questions || questions.length === 0) {
      return res.status(500).json({ message: "Failed to generate questions" });
    }

    // Build title
    const title = `${collection.name} — ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz`;

    // Save quiz to MongoDB
    const quiz = await Quiz.create({
      userId: req.user._id,
      collectionId,
      title,
      difficulty,
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        topic: q.topic || "General",
      })),
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Generate quiz error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/quiz/:id/submit
export const submitQuiz = async (req, res) => {
  try {
    const { userAnswers, timeTaken = 0 } = req.body;
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (!userAnswers || userAnswers.length !== quiz.questions.length) {
      return res
        .status(400)
        .json({ message: "Answer count does not match question count" });
    }

    // Build questions array for RAG service
    const questionsForRag = quiz.questions.map((q) => ({
      question: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      topic: q.topic,
    }));

    // Call Python RAG service for evaluation
    const ragResponse = await axios.post(`${RAG_URL}/quiz/evaluate`, {
      collection_id: quiz.collectionId.toString(),
      questions: questionsForRag,
      user_answers: userAnswers,
    }, { timeout: 120000 });

    const { score, total, percentage, grade, results } = ragResponse.data;

    // Build attempt
    const attempt = {
      answers: results.map((r) => ({
        questionIndex: r.questionIndex,
        userAnswer: r.userAnswer,
        correctAnswer: r.correctAnswer,
        isCorrect: r.isCorrect,
        explanation: r.explanation,
      })),
      score,
      totalQuestions: total,
      percentage,
      grade,
      timeTaken,
      attemptedAt: new Date(),
    };

    quiz.attempts.push(attempt);
    await quiz.save();

    // Return last attempt
    const savedAttempt = quiz.attempts[quiz.attempts.length - 1];

    res.json({
      attemptId: savedAttempt._id,
      score,
      total,
      percentage,
      grade,
      timeTaken,
      results,
    });
  } catch (error) {
    console.error("Submit quiz error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quiz
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id })
      .populate("collectionId", "name category")
      .sort({ createdAt: -1 })
      .lean();

    const simplified = quizzes.map((q) => {
      const bestAttempt = q.attempts.reduce(
        (best, a) => (a.percentage > (best?.percentage || 0) ? a : best),
        null
      );
      return {
        _id: q._id,
        title: q.title,
        difficulty: q.difficulty,
        collection: q.collectionId,
        questionCount: q.questions.length,
        attemptCount: q.attempts.length,
        bestScore: bestAttempt?.percentage || null,
        createdAt: q.createdAt,
      };
    });

    res.json(simplified);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quiz/history
export const getQuizHistory = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id })
      .populate("collectionId", "name category")
      .sort({ createdAt: -1 })
      .lean();

    // Flatten all attempts across all quizzes
    const history = [];
    for (const quiz of quizzes) {
      for (const attempt of quiz.attempts) {
        history.push({
          quizId: quiz._id,
          attemptId: attempt._id,
          title: quiz.title,
          difficulty: quiz.difficulty,
          collection: quiz.collectionId,
          score: attempt.score,
          totalQuestions: attempt.totalQuestions,
          percentage: attempt.percentage,
          grade: attempt.grade,
          timeTaken: attempt.timeTaken,
          attemptedAt: attempt.attemptedAt,
        });
      }
    }

    // Sort by most recent
    history.sort(
      (a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt)
    );

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quiz/:id
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("collectionId", "name category");

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quiz/:id/attempts/:attemptId
export const getAttemptResult = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("collectionId", "name category");

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const attempt = quiz.attempts.id(req.params.attemptId);
    if (!attempt)
      return res.status(404).json({ message: "Attempt not found" });

    res.json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        difficulty: quiz.difficulty,
        collection: quiz.collectionId,
        questions: quiz.questions,
      },
      attempt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/quiz/:id
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
