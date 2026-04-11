import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, ArrowLeft, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Clock, Target, Loader2, Sparkles, RotateCcw
} from "lucide-react";
import { getAttemptResult } from "@/utils/api";
import useQuizStore from "@/stores/quizStore";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const GRADE_CONFIG = {
  Excellent: { emoji: "🏆", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  Good: { emoji: "🌟", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  Average: { emoji: "📊", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  "Below Average": { emoji: "📝", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  "Needs Improvement": { emoji: "💪", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
};

export default function QuizResultPage() {
  const { id, attemptId } = useParams();
  const navigate = useNavigate();
  const { result: storeResult, activeQuiz } = useQuizStore();

  const [resultData, setResultData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    if (attemptId) {
      // Viewing from history
      getAttemptResult(id, attemptId)
        .then((res) => {
          const { quiz, attempt } = res.data;
          setQuizData(quiz);
          setResultData({
            score: attempt.score,
            total: attempt.totalQuestions,
            percentage: attempt.percentage,
            grade: attempt.grade,
            timeTaken: attempt.timeTaken,
            results: attempt.answers.map((a, i) => ({
              ...a,
              question: quiz.questions[i]?.question,
              options: quiz.questions[i]?.options,
              topic: quiz.questions[i]?.topic,
            })),
          });
        })
        .catch(() => navigate("/quiz"))
        .finally(() => setLoading(false));
    } else if (storeResult) {
      // Just submitted
      setResultData(storeResult);
      setQuizData(activeQuiz);
      setLoading(false);
    } else {
      navigate("/quiz");
    }
  }, [id, attemptId]);

  const formatTime = (s) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-violet-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!resultData) return null;

  const { score, total, percentage, grade, timeTaken, results } = resultData;
  const gradeStyle = GRADE_CONFIG[grade] || GRADE_CONFIG["Average"];
  const correctCount = results?.filter((r) => r.isCorrect).length || score;
  const wrongCount = total - correctCount;

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-3xl py-10 px-4 sm:px-6"
      >
        {/* Score Card */}
        <motion.div
          variants={fadeUp}
          className="mb-8 p-8 bg-white rounded-2xl border border-slate-100 card-glow text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-5xl mb-3"
          >
            {gradeStyle.emoji}
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-6xl font-bold text-slate-900 font-[Syne] mb-1">
              {percentage}%
            </p>
            <div
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold ${gradeStyle.bg} ${gradeStyle.color} ${gradeStyle.border} border`}
            >
              <Trophy className="h-4 w-4" />
              {grade}
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-100">
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xl font-bold text-slate-900">{correctCount}</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Correct</p>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center">
                <XCircle className="h-4 w-4 text-rose-500" />
                <span className="text-xl font-bold text-slate-900">{wrongCount}</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Wrong</p>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-xl font-bold text-slate-900">
                  {formatTime(timeTaken)}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Time</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => navigate("/quiz")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              All Quizzes
            </button>
            <button
              onClick={() => navigate("/collections")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              New Quiz
            </button>
          </div>
        </motion.div>

        {/* Question Review */}
        <motion.div variants={fadeUp}>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-500" />
            Question Review
          </h2>

          <div className="space-y-3">
            {results?.map((r, i) => {
              const isExpanded = expandedQ === i;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                    r.isCorrect ? "border-emerald-100" : "border-rose-100"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          r.isCorrect
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {r.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 mb-2">
                          {r.question || `Question ${i + 1}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold ${
                              r.isCorrect
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            Your answer: {r.userAnswer || "—"}
                          </span>
                          {!r.isCorrect && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Correct: {r.correctAnswer}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedQ(isExpanded ? null : i)}
                        className="shrink-0 p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-50 bg-gradient-to-b from-violet-50/30 to-transparent px-5 py-4">
                          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">
                            AI Explanation
                          </p>
                          <p className="text-sm leading-relaxed text-slate-600 font-medium">
                            {r.explanation || "No explanation available."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
