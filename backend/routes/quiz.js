import { Router } from "express";
import {
  generateQuiz,
  submitQuiz,
  getQuizzes,
  getQuizHistory,
  getQuizById,
  getAttemptResult,
  deleteQuiz,
} from "../controllers/quizController.js";
import protect from "../middleware/auth.js";

const quizRoutes = Router();

quizRoutes.use(protect);
quizRoutes.post("/generate", generateQuiz);
quizRoutes.post("/:id/submit", submitQuiz);
quizRoutes.get("/history", getQuizHistory); // Must be before /:id
quizRoutes.get("/", getQuizzes);
quizRoutes.get("/:id", getQuizById);
quizRoutes.get("/:id/attempts/:attemptId", getAttemptResult);
quizRoutes.delete("/:id", deleteQuiz);

export default quizRoutes;
