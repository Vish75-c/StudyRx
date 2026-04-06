import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain, FileText, Youtube, Globe, Shield, Zap, ChevronRight, Sparkles,
  BookOpen, Search, Lock, MessageSquare, Database, Users, HelpCircle, 
  CheckCircle2, ArrowRight, Activity
} from "lucide-react";
import Footer from "@/components/Common/footer";
const features = [
  { icon: <FileText className="h-5 w-5" />, title: "PDF Upload", desc: "Upload medical reports, research papers and clinical guidelines for instant AI-powered analysis." },
  { icon: <Globe className="h-5 w-5" />, title: "URL Ingestion", desc: "Paste any medical website link and chat with its content — from PubMed to WHO guidelines." },
  { icon: <Youtube className="h-5 w-5" />, title: "YouTube Lectures", desc: "Extract transcripts from medical lectures and conference seminars automatically." },
  { icon: <Shield className="h-5 w-5" />, title: "Source Citations", desc: "Every answer comes with exact document name, page number and highlighted passages." },
  { icon: <Zap className="h-5 w-5" />, title: "AI Powered", desc: "Powered by LLaMA3 via Groq for fast, intelligent and contextually aware medical responses." },
  { icon: <Sparkles className="h-5 w-5" />, title: "Collections", desc: "Organise documents into collections by specialty, rotation or research topic." },
];

const steps = [
  { step: "01", title: "Upload Documents", desc: "Upload PDFs, paste URLs or add YouTube medical lectures." },
  { step: "02", title: "AI Processing", desc: "Our RAG pipeline chunks and indexes your content intelligently." },
  { step: "03", title: "Chat & Verify", desc: "Ask questions and get precise answers with source citations." },
];

const useCases = [
  { icon: <BookOpen className="h-6 w-6" />, title: "Medical Students", desc: "Study smarter by uploading textbooks and lecture slides. Get instant answers with page references." },
  { icon: <Search className="h-6 w-6" />, title: "Clinical Researchers", desc: "Ingest dozens of research papers and query across all of them simultaneously." },
  { icon: <Users className="h-6 w-6" />, title: "Practicing Physicians", desc: "Keep clinical guidelines and protocol documents at your fingertips during consultations." },
  { icon: <Database className="h-6 w-6" />, title: "Hospital Teams", desc: "Build shared knowledge bases by department—radiology, surgery—with role-based access." },
];

const techSpecs = [
  { label: "Embedding Model", value: "text-embedding-3-small" },
  { label: "LLM Engine", value: "LLaMA3-70B via Groq" },
  { label: "Vector Database", value: "Pinecone (Serverless)" },
  { label: "Chunk Strategy", value: "Recursive (512 tokens)" },
  { label: "Security", value: "AES-256 Encryption" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-100 relative overflow-hidden">
      {/* Visual Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-violet-200/30 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-200/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://play.tailwindcss.com/img/grid.svg')] bg-center mark-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 shadow-lg shadow-violet-200">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">MediQuery</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Features</a>
            <a href="#use-cases" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Use Cases</a>
            <a href="#architecture" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">Architecture</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-600" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 shadow-md text-white" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-28 md:py-36">
        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge className="mb-6 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100 px-4 py-1.5 text-xs font-medium tracking-wide">
            <Sparkles className="h-3.5 w-3.5 mr-2 inline" />
            AI-Powered Medical Knowledge Base
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl text-slate-900">
            Chat With Your <br />
            <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Medical Documents
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
            Upload reports, research, and guidelines. Get instant AI answers with 
            <span className="font-semibold text-slate-800"> verified source citations</span>. 
            Built for the modern clinician and medical student.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white" asChild>
              <Link to="/register" className="flex items-center gap-2">
                Start for Free <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-slate-200 text-slate-700 hover:bg-white" asChild>
              <Link to="/login">Watch Demo</Link>
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 opacity-40 grayscale contrast-125">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tighter text-slate-900"><Activity className="h-5 w-5"/> PubMed</div>
            <div className="font-bold text-lg tracking-tighter text-slate-900">HIPAA</div>
            <div className="font-bold text-lg tracking-tighter text-slate-900">LLaMA 3</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 bg-white/50 border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything You Need</h2>
            <p className="mt-3 text-slate-500 text-lg">Powerful features built for healthcare professionals</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How It Works</h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-5xl font-extrabold text-violet-100 group-hover:text-violet-200 transition-colors duration-300 leading-none mb-4">{s.step}</div>
                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="relative py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built For Every Medical Role</h2>
            <p className="mt-3 text-slate-400 text-lg">From students to hospital teams, MediQuery adapts to your workflow</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {useCases.map((uc, i) => (
              <div key={i} className="flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
                  {uc.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{uc.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section id="architecture" className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Enterprise-Grade RAG</h2>
              <p className="mt-3 text-slate-500">Secure, high-performance architecture under the hood</p>
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              {techSpecs.map((spec, i) => (
                <div key={i} className={`flex items-center justify-between px-8 py-4 ${i < techSpecs.length - 1 ? "border-b border-slate-100" : ""}`}>
                  <span className="text-sm font-semibold text-slate-700">{spec.label}</span>
                  <span className="text-sm font-mono text-violet-600">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50/50 p-8">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4">
                <Lock className="h-4 w-4 text-violet-600" /> Security & Privacy
              </h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {["AES-256 Encryption", "No data training", "SOC 2 Type II compliant", "HIPAA Ready Architecture"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-linear-to-br from-violet-600 to-indigo-700 p-12 md:p-20 text-center text-white shadow-2xl shadow-violet-200">
            <h2 className="text-3xl font-bold sm:text-5xl leading-tight">Ready to query your <br />medical data?</h2>
            <p className="mt-6 text-violet-100 text-lg opacity-90">Join thousands of healthcare professionals today.</p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-violet-600 hover:bg-slate-50 h-14 px-10 text-base font-bold rounded-xl" asChild>
                <Link to="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white h-14 px-10 rounded-xl" asChild>
                <Link to="/login">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}