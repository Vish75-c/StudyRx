import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Youtube,
  Globe,
  Shield,
  Zap,
  ChevronRight,
  Sparkles,
  BookOpen,
  Search,
  Lock,
  MessageSquare,
  Database,
  Users,
  CheckCircle2,
  Activity,
  ArrowRight,
  Heart,
  Cpu,
  Layers,
} from "lucide-react";
import Footer from "@/components/Common/footer";
import studying from "../assests/studying.webp"
/* ── animation helpers ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ── data ── */
const features = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: "PDF Upload",
    desc: "Upload medical reports, research papers and clinical guidelines for instant AI-powered analysis.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "URL Ingestion",
    desc: "Paste any medical website link and chat with its content — from PubMed to WHO guidelines.",
    color: "from-sky-500 to-cyan-600",
  },
  {
    icon: <Youtube className="h-5 w-5" />,
    title: "YouTube Lectures",
    desc: "Extract transcripts from medical lectures and conference seminars automatically.",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Source Citations",
    desc: "Every answer comes with exact document name, page number and highlighted passages.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "AI Powered",
    desc: "Powered by LLaMA3 via Groq for fast, intelligent and contextually aware medical responses.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Collections",
    desc: "Organise documents into collections by specialty, rotation or research topic.",
    color: "from-violet-500 to-purple-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload Documents",
    desc: "Upload PDFs, paste URLs or add YouTube medical lectures.",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    step: "02",
    title: "AI Processing",
    desc: "Our RAG pipeline chunks and indexes your content intelligently.",
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    step: "03",
    title: "Chat & Verify",
    desc: "Ask questions and get precise answers with source citations.",
    icon: <MessageSquare className="h-6 w-6" />,
  },
];

const useCases = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Medical Students",
    desc: "Study smarter by uploading textbooks and lecture slides. Get instant answers with page references.",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Clinical Researchers",
    desc: "Ingest dozens of research papers and query across all of them simultaneously.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Practicing Physicians",
    desc: "Keep clinical guidelines and protocol documents at your fingertips during consultations.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Hospital Teams",
    desc: "Build shared knowledge bases by department—radiology, surgery—with role-based access.",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
];

const techSpecs = [
  {
    label: "Embedding Model",
    value: "text-embedding-3-small",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    label: "LLM Engine",
    value: "LLaMA3-70B via Groq",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    label: "Vector Database",
    value: "Pinecone (Serverless)",
    icon: <Database className="h-4 w-4" />,
  },
  {
    label: "Chunk Strategy",
    value: "Recursive (512 tokens)",
    icon: <Zap className="h-4 w-4" />,
  },
 
];

/* ── floating shapes for hero ── */
function HeroShapes() {
  const shapes = [
    { icon: <Heart className="h-5 w-5" />, x: "10%", y: "20%", delay: 0 },
    { icon: <Shield className="h-4 w-4" />, x: "85%", y: "15%", delay: 1 },
    { icon: <FileText className="h-5 w-5" />, x: "75%", y: "70%", delay: 2 },
    { icon: <Brain className="h-6 w-6" />, x: "15%", y: "75%", delay: 0.5 },
    { icon: <Activity className="h-4 w-4" />, x: "50%", y: "10%", delay: 1.5 },
    { icon: <Sparkles className="h-4 w-4" />, x: "90%", y: "50%", delay: 2.5 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute text-violet-300/30"
          style={{ left: s.x, top: s.y }}
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        >
          {s.icon}
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-100 relative overflow-hidden">
      {/* ═══ Navbar ═══ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-slate-200/80 glass"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200 group-hover:shadow-violet-300 transition-shadow duration-300">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 font-[Syne]">
              StudyRx
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Use Cases", "Architecture"].map((t) => (
              <a
                key={t}
                href={`#${t.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium text-slate-500 hover:text-violet-600 transition-colors relative group"
              >
                {t}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-600 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-violet-600"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              size="sm"
              className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 text-white border-0"
              asChild
            >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ═══ Hero ═══ */}
      <section className="relative py-28 md:py-40 grid-bg overflow-hidden">
        <HeroShapes />

        {/* gradient orbs */}
        {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-mesh" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-mesh" style={{ animationDelay: "5s" }} /> */}
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${studying})` }}
        />

        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black/50" /> */}
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0}>
              <Badge className="mb-6 bg-violet-100/80 text-violet-700 border-violet-200/60 hover:bg-violet-100 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 mr-2 inline animate-pulse" />
                AI-Powered Medical Knowledge Base
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl text-slate-900 font-[Syne]"
            >
              Chat With Your <br />
              <span
                className="bg-linear-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift"
                style={{ backgroundSize: "200% 200%" }}
              >
                Medical Documents
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-900 md:text-lg"
            >
              Upload reports, research and guidelines. Chat with ingestions and improve knowledge
              with{" "}
              <span className="font-semibold text-slate-800">
                verified source citations
              </span>
              . Built for the  medical student.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button
                size="lg"
                className="h-13 px-8 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-200/50 border-0 group"
                asChild
              >
                <Link to="/register" className="flex items-center gap-2">
                  Start for Free
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 border-slate-200 text-slate-700 hover:bg-white hover:border-violet-200 hover:text-violet-700 transition-all"
                asChild
              >
                <Link to="/login">Watch Demo</Link>
              </Button>
            </motion.div>

            {/* trust bar */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-20 flex items-center justify-center gap-10 opacity-40"
            >
              <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-slate-900">
                Embedding
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="font-bold text-sm tracking-tight text-slate-900">
                RecursiveChunking
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="font-bold text-sm tracking-tight text-slate-900">
                LLaMA 3
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="font-bold text-sm tracking-tight text-slate-900">
                Pinecone
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Features ═══ */}
      <section
        id="features"
        className="relative py-28 bg-white border-y border-slate-100"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-violet-50 text-violet-600 border-violet-100 text-xs">
                Features
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-[Syne]"
            >
              Everything You Need
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-slate-500 text-lg">
              Powerful features built for healthcare professionals
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-slate-100 bg-white p-7 transition-all card-glow-hover cursor-default"
              >
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${f.color} text-white shadow-lg shadow-slate-200/50 group-hover:scale-110 transition-transform duration-300`}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ How it Works ═══ */}
      <section className="relative py-28 md:py-36 grid-bg overflow-hidden">
        <div className="absolute top-0 left-1/2 w-px h-full bg-linear-to-b from-transparent via-violet-200 to-transparent hidden sm:block" />

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-violet-50 text-violet-600 border-violet-100 text-xs">
                How it works
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-[Syne]"
            >
              Three Simple Steps
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mt-20 grid gap-10 sm:grid-cols-3 relative"
          >
            {steps.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="relative group"
              >
                {/* connector dot */}
                <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 -translate-y-10 w-4 h-4 rounded-full bg-linear-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-200 z-10" />

                <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center card-glow group-hover:border-violet-200 transition-all">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-50 to-indigo-50 text-violet-600 group-hover:from-violet-100 group-hover:to-indigo-100 transition-colors">
                    {s.icon}
                  </div>
                  <div className="text-xs font-bold text-violet-400 tracking-widest uppercase mb-2">
                    Step {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ Use Cases ═══ */}
      <section
        id="use-cases"
        className="relative py-28 bg-slate-900 text-white overflow-hidden"
      >
        {/* ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-white/10 text-violet-300 border-white/10 text-xs backdrop-blur-sm">
                Use Cases
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl font-[Syne]"
            >
              Built For Every Medical Role
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-slate-400 text-lg">
              From students to hospital teams, StudyRx adapts to your workflow
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2"
          >
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all hover:bg-white/8 hover:border-white/20 cursor-default"
              >
                <div
                  className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${uc.gradient} text-violet-300 border border-white/10`}
                >
                  {uc.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{uc.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {uc.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ Technical Architecture ═══ */}
      <section id="architecture" className="relative py-28 grid-bg">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-12"
            >
              <motion.div variants={fadeUp}>
                <Badge className="mb-4 bg-violet-50 text-violet-600 border-violet-100 text-xs">
                  Architecture
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-bold text-slate-900 sm:text-4xl font-[Syne]"
              >
                Enterprise-Grade RAG
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-3 text-slate-500">
                Secure, high-performance architecture under the hood
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm card-glow"
            >
              {techSpecs.map((spec, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className={`flex items-center justify-between px-7 py-4.5 hover:bg-violet-50/30 transition-colors ${i < techSpecs.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2.5">
                    <span className="text-violet-500">{spec.icon}</span>
                    {spec.label}
                  </span>
                  <span className="text-sm font-mono text-violet-600 bg-violet-50 px-3 py-1 rounded-lg">
                    {spec.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-28">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="mx-auto max-w-4xl rounded-[2.5rem] bg-linear-to-br from-violet-600 via-indigo-600 to-purple-700 p-12 md:p-20 text-center text-white shadow-2xl shadow-violet-300/30 relative overflow-hidden"
          >
            {/* decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold sm:text-5xl leading-tight font-[Syne]">
                Ready to query your <br />
                medical data?
              </h2>
              <p className="mt-6 text-violet-100 text-lg opacity-90">
                Join thousands of healthcare professionals today.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-violet-600 hover:bg-slate-50 h-14 px-10 text-base font-bold rounded-xl shadow-xl border-0 group"
                  asChild
                >
                  <Link to="/register" className="flex items-center gap-2">
                    Create Free Account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white h-14 px-10 rounded-xl backdrop-blur-sm"
                  asChild
                >
                  <Link to="/login">Contact Support</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
