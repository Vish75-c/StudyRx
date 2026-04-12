import { motion, AnimatePresence } from "framer-motion";
import { Pill, Sparkles } from "lucide-react";

const pulseRing = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.6, 2.2],
    opacity: [0.5, 0.2, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeOut" },
  },
};

const pulseRing2 = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.4, 2],
    opacity: [0.4, 0.15, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 },
  },
};

const iconSpin = {
  animate: {
    rotateY: [0, 360],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      delay: 0.3 + i * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const taglineVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 1.2, ease: "easeOut" },
  },
};

const dotsVariants = {
  animate: {
    transition: { staggerChildren: 0.2, repeat: Infinity },
  },
};

const dotVariant = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatingParticles = [
  { x: "15%", y: "20%", size: 4, delay: 0, duration: 4 },
  { x: "80%", y: "25%", size: 3, delay: 0.5, duration: 5 },
  { x: "25%", y: "75%", size: 5, delay: 1, duration: 4.5 },
  { x: "70%", y: "70%", size: 3, delay: 1.5, duration: 3.5 },
  { x: "50%", y: "15%", size: 4, delay: 0.8, duration: 5.5 },
  { x: "90%", y: "55%", size: 3, delay: 2, duration: 4.2 },
];

const projectName = "StudyRx";

export default function Loader({ show = true }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50"
        >
          {/* Floating particles */}
          {floatingParticles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-violet-400/20"
              style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, -10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Ambient glow */}
          <div className="absolute w-80 h-80 bg-violet-300/10 rounded-full blur-3xl" />
          <div className="absolute w-60 h-60 bg-indigo-300/10 rounded-full blur-3xl translate-x-20 translate-y-10" />

          {/* Logo icon with pulse rings */}
          <div className="relative mb-8">
            {/* Pulse rings */}
            <motion.div
              variants={pulseRing}
              initial="initial"
              animate="animate"
              className="absolute inset-0 m-auto w-20 h-20 rounded-2xl border-2 border-violet-400/30"
            />
            <motion.div
              variants={pulseRing2}
              initial="initial"
              animate="animate"
              className="absolute inset-0 m-auto w-20 h-20 rounded-2xl border-2 border-indigo-400/20"
            />

            {/* Main logo container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.8,
              }}
              className="relative"
            >
              <motion.div
                variants={iconSpin}
                animate="animate"
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-300/50"
                style={{ perspective: 800 }}
              >
                <Pill className="h-9 w-9 text-white drop-shadow-lg" />
              </motion.div>

              {/* Sparkle accent */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-5 w-5 text-amber-400 drop-shadow-lg" />
              </motion.div>
            </motion.div>
          </div>

          {/* Animated project name */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex items-baseline gap-0.5 mb-3"
          >
            {projectName.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                className={`text-4xl font-extrabold font-[Syne] tracking-tight ${
                  i < 5
                    ? "text-slate-900"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
                }`}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={taglineVariants}
            initial="hidden"
            animate="visible"
            className="text-sm text-slate-400 font-medium tracking-wide mb-10"
          >
            Your AI study partner
          </motion.p>

          {/* Loading dots */}
          <motion.div
            variants={dotsVariants}
            animate="animate"
            className="flex items-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={dotVariant}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 shadow-md shadow-violet-200/50"
              />
            ))}
          </motion.div>

          {/* Subtle progress bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "160px" }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            className="mt-6 h-1 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 shadow-sm"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
