import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain, FileText, Youtube, Globe, Shield, Zap, ChevronRight, Sparkles,
  BookOpen, Search, Lock, MessageSquare, Database, Users, HelpCircle, CheckCircle2,
  ArrowRight, Activity
} from "lucide-react";

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
  { icon: <Search className="h-6 w-6" />, title: "Clinical Researchers", desc: "Ingest dozens of research papers and query across all of them simultaneously to find patterns." },
  { icon: <Users className="h-6 w-6" />, title: "Practicing Physicians", desc: "Keep clinical guidelines and protocol documents at your fingertips during patient consultations." },
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
    <div className="min-h-screen bg-[#eae6e6] text-slate-900 selection:bg-violet-100">
      {/* Visual Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-violet-200/30 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-200/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://play.tailwindcss.com/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-violet-100 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-200">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">MediQuery</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 mr-8">
             <Link to="#" className="text-sm font-medium text-slate-600 hover:text-violet-600">Features</Link>
             <Link to="#" className="text-sm font-medium text-slate-600 hover:text-violet-600">Use Cases</Link>
             <Link to="#" className="text-sm font-medium text-slate-600 hover:text-violet-600">Security</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-slate-600" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700 shadow-md transition-all hover:translate-y-[-1px]" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex items-center pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge className="mb-8 bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 px-4 py-1.5 transition-colors">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Next-Gen RAG for Healthcare
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold  tracking-tight sm:text-6xl md:text-7xl text-slate-900">
            Chat With Your <br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Medical Knowledge
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
            Upload reports, research, and guidelines. Get instant AI answers with 
            <span className="font-semibold text-slate-800"> verified source citations</span>. 
            Built for the modern clinician.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-14 px-8 bg-violet-600 hover:bg-violet-700 text-base" asChild>
              <Link to="/register" className="flex items-center gap-2">
                Start Analysis for Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 border-violet-200 text-slate-700 hover:bg-violet-50" asChild>
              <Link to="/login">Watch Demo</Link>
            </Button>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 opacity-50 grayscale">
            <Activity className="h-8 w-8" />
            <span className="font-bold text-xl uppercase tracking-widest">PubMed</span>
            <span className="font-bold text-xl uppercase tracking-widest">HL7</span>
            <span className="font-bold text-xl uppercase tracking-widest">HIPAA</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 bg-white border-y border-violet-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything You Need</h2>
              <p className="mt-4 text-slate-600 text-lg">Powerful features optimized for high-stakes medical data.</p>
            </div>
            <Button variant="link" className="text-violet-600 p-0 h-auto">View all features <ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="group relative rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases - Side by Side */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Built For Every Role</h2>
            <p className="mt-4 text-slate-600">MediQuery adapts to your specific clinical workflow.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {useCases.map((uc, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-6 rounded-2xl bg-white border border-slate-100 p-8 shadow-sm transition-transform hover:scale-[1.01]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  {uc.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{uc.title}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="rounded-3xl bg-slate-900 p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 blur-[100px]" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Enterprise-Grade <br />Architecture</h2>
                <div className="space-y-4">
                  {techSpecs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/10">
                      <span className="text-slate-400 text-sm font-medium">{spec.label}</span>
                      <span className="text-violet-300 text-sm font-mono">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
                  <Shield className="h-5 w-5 text-violet-400" /> Trust & Compliance
                </h3>
                <ul className="space-y-4">
                   {["AES-256 Encryption at rest", "No training on user data", "SOC2 Type II Compliant", "HIPAA Ready Architecture"].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-violet-400" /> {item}
                     </li>
                   ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-indigo-700 p-12 md:p-20 text-center text-white shadow-2xl shadow-violet-200">
            <h2 className="text-3xl font-bold sm:text-5xl">Start querying your <br />medical data today.</h2>
            <p className="mx-auto mt-6 max-w-xl text-violet-100 text-lg opacity-90">
              Join thousands of healthcare professionals streamlining their research and clinical practice.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-violet-600 hover:bg-slate-50 h-14 px-10 text-base font-bold">
                Create Free Account
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white h-14 px-10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600" />
            <span className="font-bold text-slate-800">MediQuery</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md text-center md:text-right italic leading-relaxed">
            ⚠️ MediQuery is an AI-assisted informational tool. It is not a substitute for professional clinical judgment or medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}