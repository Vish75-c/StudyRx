import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain, Plus, Trash2, Play, RotateCcw,
  Loader2, GraduationCap, Target, Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { getQuizzes, deleteQuizApi } from "@/utils/api";
import useQuizStore from "@/stores/quizStore";

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

export default function QuizPage() {
  const navigate = useNavigate();
  const { quizzes, setQuizzes, removeQuiz, setActiveQuiz, resetQuiz } = useQuizStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resetQuiz();
    getQuizzes()
      .then((res) => setQuizzes(res.data))
      .catch(() => toast.error("Failed to load quizzes"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, quizId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this quiz and all its attempts?")) return;
    try {
      await deleteQuizApi(quizId);
      removeQuiz(quizId);
      toast.success("Quiz deleted");
    } catch {
      toast.error("Failed to delete quiz");
    }
  };

  const handleStart = (quiz) => {
    setActiveQuiz(null); // Force reload
    navigate(`/quiz/${quiz._id}/attempt`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-white border border-slate-100 rounded-2xl animate-pulse" />
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
        className="mx-auto max-w-6xl py-10 px-4 sm:px-6"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200/50">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-[Syne]">My Quizzes</h1>
              <p className="text-sm text-slate-500 font-medium">
                {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} generated
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/collections")}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Quiz
          </button>
        </motion.div>

        {/* Grid */}
        {quizzes.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white"
          >
            <div className="mb-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <GraduationCap className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-900 font-[Syne]">No quizzes yet</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Go to a collection and click the Quiz button to generate your first quiz.
            </p>
            <button
              onClick={() => navigate("/collections")}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Browse Collections
            </button>
          </motion.div>
        ) : (
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz, i) => (
              <motion.div
                key={quiz._id}
                variants={fadeUp}
                custom={i}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden card-glow-hover transition-all cursor-pointer"
                onClick={() => handleStart(quiz)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate mb-1">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium truncate">
                        {quiz.collection?.name || "Collection"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, quiz._id)}
                      className="shrink-0 p-1.5 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${DIFF_STYLES[quiz.difficulty] || DIFF_STYLES.medium}`}>
                      {quiz.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {quiz.questionCount} questions
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      {quiz.bestScore !== null ? (
                        <div className="flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5 text-violet-500" />
                          <span className="text-xs font-bold text-slate-700">
                            Best: {quiz.bestScore}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">Not attempted</span>
                      )}
                      {quiz.attemptCount > 0 && (
                        <span className="text-xs text-slate-400 font-medium">
                          {quiz.attemptCount} attempt{quiz.attemptCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-violet-600 bg-violet-50 rounded-lg border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
                      {quiz.attemptCount > 0 ? (
                        <>
                          <RotateCcw className="h-3 w-3" /> Retake
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" /> Start
                        </>
                      )}
                    </div>
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
