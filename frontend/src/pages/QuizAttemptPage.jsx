import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ChevronLeft, ChevronRight, Loader2,
  CheckCircle2, AlertTriangle, Send, Brain
} from "lucide-react";
import toast from "react-hot-toast";
import { getQuizById, submitQuiz } from "@/utils/api";
import useQuizStore from "@/stores/quizStore";

export default function QuizAttemptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    activeQuiz, setActiveQuiz,
    currentQuestion, userAnswers,
    selectAnswer, nextQuestion, prevQuestion, goToQuestion,
    timeLeft, setTimeLeft,
    isSubmitting, setIsSubmitting,
    setResult,
  } = useQuizStore();

  const [loading, setLoading] = useState(!activeQuiz);
  const timerRef = useRef(null);
  const hasAutoSubmitted = useRef(false);

  // Load quiz if not in store
  useEffect(() => {
    if (activeQuiz && activeQuiz._id === id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getQuizById(id)
      .then((res) => {
        const quiz = res.data;
        setActiveQuiz(quiz);
        setTimeLeft(quiz.questions.length * 60);
      })
      .catch(() => {
        toast.error("Failed to load quiz");
        navigate("/quiz");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Initialize timer when quiz loads
  useEffect(() => {
    if (activeQuiz && timeLeft === 0) {
      setTimeLeft(activeQuiz.questions.length * 60);
    }
  }, [activeQuiz]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const startTime = activeQuiz.questions.length * 60;
    const timeTaken = startTime - timeLeft;

    try {
      const res = await submitQuiz(activeQuiz._id, {
        userAnswers,
        timeTaken,
      });
      setResult(res.data);
      toast.success("Quiz submitted!");
      navigate(`/quiz/${activeQuiz._id}/result`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  }, [activeQuiz, userAnswers, timeLeft, isSubmitting]);

  // Countdown timer
  useEffect(() => {
    if (!activeQuiz || loading) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!hasAutoSubmitted.current) {
            hasAutoSubmitted.current = true;
            toast("Time's up! Auto-submitting...", { icon: "⏰" });
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [activeQuiz, loading, handleSubmit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-violet-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!activeQuiz) return null;

  const questions = activeQuiz.questions;
  const question = questions[currentQuestion];
  const answeredCount = userAnswers.filter((a) => a !== "").length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLast = currentQuestion === questions.length - 1;
  const isTimeLow = timeLeft < 60;

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <div className="mx-auto max-w-6xl py-6 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-100 card-glow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 shadow-sm shrink-0">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-slate-900 truncate">
                  {activeQuiz.title}
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">
                  {answeredCount}/{questions.length} answered
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                isTimeLow
                  ? "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                  : "bg-slate-50 text-slate-700 border border-slate-200"
              }`}
            >
              <Clock className={`h-4 w-4 ${isTimeLow ? "text-red-500" : "text-slate-400"}`} />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-violet-600 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="mb-6"
          >
            <div className="p-6 bg-white rounded-2xl border border-slate-100 card-glow">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                {question.topic && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    {question.topic}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-relaxed mb-6">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {Object.entries(question.options).map(([key, value]) => {
                  const isSelected = userAnswers[currentQuestion] === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectAnswer(currentQuestion, key)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                        isSelected
                          ? "bg-linear-to-r from-violet-50 to-indigo-50 border-2 border-violet-300 shadow-sm"
                          : "bg-slate-50 border border-slate-200 hover:bg-violet-50/50 hover:border-violet-200"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                          isSelected
                            ? "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/50"
                            : "bg-white border border-slate-200 text-slate-500"
                        }`}
                      >
                        {key}
                      </span>
                      <span
                        className={`text-sm font-medium ${isSelected ? "text-violet-900" : "text-slate-700"}`}
                      >
                        {value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 card-glow">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Question Navigator
          </p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, i) => {
              const isAnswered = userAnswers[i] !== "";
              const isCurrent = i === currentQuestion;
              return (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isCurrent
                      ? "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/50 scale-110"
                      : isAnswered
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-50 text-slate-400 border border-slate-200 hover:bg-violet-50 hover:text-violet-600"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-linear-to-br from-violet-600 to-indigo-600" />
              Current
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-emerald-100 border border-emerald-200" />
              Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-slate-100 border border-slate-200" />
              Unanswered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
