import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  History, Trophy, Target, Clock,
  Loader2, GraduationCap, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import { getQuizHistory } from "@/utils/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const DIFF_STYLES = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-rose-50 text-rose-700 border-rose-200",
};

const GRADE_COLORS = {
  Excellent: "text-emerald-600",
  Good: "text-blue-600",
  Average: "text-amber-600",
  "Below Average": "text-orange-600",
  "Needs Improvement": "text-rose-600",
};

const SCORE_RING_COLOR = (pct) => {
  if (pct >= 90) return "stroke-emerald-500";
  if (pct >= 75) return "stroke-blue-500";
  if (pct >= 60) return "stroke-amber-500";
  if (pct >= 40) return "stroke-orange-500";
  return "stroke-rose-500";
};

function ScoreCircle({ percentage }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="3" />
        <circle
          cx="22" cy="22" r={radius} fill="none"
          className={SCORE_RING_COLOR(percentage)}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-700">{percentage}%</span>
      </div>
    </div>
  );
}

export default function QuizHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuizHistory()
      .then((res) => setHistory(res.data))
      .catch(() => toast.error("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (s) => {
    if (!s) return "—";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  // Stats
  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0
    ? Math.round(history.reduce((sum, h) => sum + h.percentage, 0) / totalAttempts)
    : 0;
  const bestScore = totalAttempts > 0
    ? Math.max(...history.map((h) => h.percentage))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-white border border-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-4xl py-10 px-4 sm:px-6"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200/50">
            <History className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-[Syne]">Quiz History</h1>
            <p className="text-sm text-slate-500 font-medium">
              Track your learning progress across all quizzes
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        {totalAttempts > 0 && (
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white rounded-2xl border border-slate-100 card-glow text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Target className="h-4 w-4 text-violet-500" />
                <span className="text-2xl font-bold text-slate-900">{totalAttempts}</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Total Attempts</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 card-glow text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-2xl font-bold text-slate-900">{avgScore}%</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Average Score</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 card-glow text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <GraduationCap className="h-4 w-4 text-emerald-500" />
                <span className="text-2xl font-bold text-slate-900">{bestScore}%</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Best Score</p>
            </div>
          </motion.div>
        )}

        {/* History list */}
        {history.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white"
          >
            <div className="mb-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <History className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-900 font-[Syne]">No attempts yet</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Complete a quiz to see your history here.
            </p>
            <button
              onClick={() => navigate("/quiz")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              View Quizzes
            </button>
          </motion.div>
        ) : (
          <motion.div variants={stagger} className="space-y-3">
            {history.map((item, i) => (
              <motion.div
                key={`${item.quizId}-${item.attemptId}`}
                variants={fadeUp}
                custom={i}
                onClick={() => navigate(`/quiz/${item.quizId}/attempts/${item.attemptId}`)}
                className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 card-glow-hover cursor-pointer transition-all"
              >
                <ScoreCircle percentage={item.percentage} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${DIFF_STYLES[item.difficulty] || DIFF_STYLES.medium}`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>{item.collection?.name || "Collection"}</span>
                    <span>•</span>
                    <span>{item.score}/{item.totalQuestions} correct</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(item.timeTaken)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-bold ${GRADE_COLORS[item.grade] || "text-slate-600"}`}>
                    {item.grade}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span>{new Date(item.attemptedAt).toLocaleDateString()}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-violet-500 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
