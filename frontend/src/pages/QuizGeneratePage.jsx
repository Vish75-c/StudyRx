import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, Brain, Zap, BookOpen, Target } from "lucide-react";
import toast from "react-hot-toast";
import { generateQuiz } from "@/utils/api";
import useQuizStore from "@/stores/quizStore";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const QUESTION_COUNTS = [5, 10, 15, 20];

const DIFFICULTIES = [
  {
    value: "easy",
    label: "Easy",
    description: "Basic recall & understanding",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    shadow: "shadow-emerald-200/50",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Conceptual & analytical thinking",
    icon: Target,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    shadow: "shadow-amber-200/50",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Deep analysis & critical thinking",
    icon: Zap,
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    shadow: "shadow-rose-200/50",
  },
];

export default function QuizGeneratePage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { addQuiz, setActiveQuiz } = useQuizStore();

  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await generateQuiz({
        collectionId,
        numQuestions,
        difficulty,
      });
      const quiz = res.data;
      addQuiz(quiz);
      setActiveQuiz(quiz);
      toast.success("Quiz generated successfully!");
      navigate(`/quiz/${quiz._id}/attempt`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const selectedDiff = DIFFICULTIES.find((d) => d.value === difficulty);

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-5xl py-10 px-4 sm:px-6"
      >
        {/* Back */}
        <motion.button
          variants={fadeUp}
          onClick={() => navigate(-1)}
          className="group mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-violet-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Collection
        </motion.button>

        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200/50">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-[Syne]">
                Generate Quiz
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                AI will create questions from your uploaded documents
              </p>
            </div>
          </div>
        </motion.div>

        {/* Number of Questions */}
        <motion.div
          variants={fadeUp}
          className="mb-6 p-6 bg-white rounded-2xl border border-slate-100 card-glow"
        >
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Number of Questions
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {QUESTION_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setNumQuestions(count)}
                className={`relative py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                  numQuestions === count
                    ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/50 scale-[1.02]"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Difficulty */}
        <motion.div
          variants={fadeUp}
          className="mb-6 p-6 bg-white rounded-2xl border border-slate-100 card-glow"
        >
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Difficulty Level
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DIFFICULTIES.map((diff) => {
              const Icon = diff.icon;
              const isSelected = difficulty === diff.value;
              return (
                <button
                  key={diff.value}
                  onClick={() => setDifficulty(diff.value)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? `${diff.bg} ${diff.border} border-2 scale-[1.02]`
                      : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center h-9 w-9 rounded-lg mb-3 ${
                      isSelected
                        ? `bg-linear-to-br ${diff.gradient} shadow-lg ${diff.shadow}`
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isSelected ? "text-white" : "text-slate-400"}`}
                    />
                  </div>
                  <p
                    className={`text-sm font-bold ${isSelected ? diff.text : "text-slate-700"}`}
                  >
                    {diff.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {diff.description}
                  </p>
                  {isSelected && (
                    <motion.div
                      layoutId="diff-indicator"
                      className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-linear-to-br ${diff.gradient}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          variants={fadeUp}
          className="mb-6 p-5 bg-linear-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-100/50"
        >
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">
            Quiz Summary
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-bold text-slate-900">
              {numQuestions} questions
            </span>
            <span className="text-slate-300">•</span>
            <span
              className={`font-bold ${selectedDiff?.text || "text-slate-900"}`}
            >
              {selectedDiff?.label || "Medium"} difficulty
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">
              ~{numQuestions} min
            </span>
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.div variants={fadeUp}>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-4 px-6 bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
          {generating && (
            <p className="text-center text-xs text-slate-400 mt-3 font-medium">
              AI is reading your documents and creating questions. This may take
              30-60 seconds...
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
