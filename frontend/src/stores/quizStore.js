import { create } from "zustand";

const useQuizStore = create((set) => ({
  quizzes: [],
  activeQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  timeLeft: 0,
  isSubmitting: false,
  result: null,

  setQuizzes: (quizzes) => set({ quizzes }),
  setActiveQuiz: (quiz) =>
    set({
      activeQuiz: quiz,
      currentQuestion: 0,
      userAnswers: quiz ? new Array(quiz.questions.length).fill("") : [],
      result: null,
    }),
  selectAnswer: (index, answer) =>
    set((state) => {
      const updated = [...state.userAnswers];
      updated[index] = answer;
      return { userAnswers: updated };
    }),
  nextQuestion: () =>
    set((state) => ({
      currentQuestion: Math.min(
        state.currentQuestion + 1,
        (state.activeQuiz?.questions?.length || 1) - 1
      ),
    })),
  prevQuestion: () =>
    set((state) => ({
      currentQuestion: Math.max(state.currentQuestion - 1, 0),
    })),
  goToQuestion: (index) => set({ currentQuestion: index }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setResult: (result) => set({ result }),
  addQuiz: (quiz) =>
    set((state) => ({ quizzes: [quiz, ...state.quizzes] })),
  removeQuiz: (id) =>
    set((state) => ({
      quizzes: state.quizzes.filter((q) => q._id !== id),
    })),
  resetQuiz: () =>
    set({
      activeQuiz: null,
      currentQuestion: 0,
      userAnswers: [],
      timeLeft: 0,
      isSubmitting: false,
      result: null,
    }),
}));

export default useQuizStore;
