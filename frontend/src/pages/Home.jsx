import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Youtube, Globe, Shield, Zap, ChevronRight } from "lucide-react";

const features = [
  { icon: <FileText className="w-6 h-6" />, title: "PDF Upload", desc: "Upload medical reports, research papers and clinical guidelines" },
  { icon: <Globe className="w-6 h-6" />, title: "URL Ingestion", desc: "Paste any medical website link and chat with its content" },
  { icon: <Youtube className="w-6 h-6" />, title: "YouTube Lectures", desc: "Extract transcripts from medical lectures and seminars" },
  { icon: <Shield className="w-6 h-6" />, title: "Source Citations", desc: "Every answer comes with exact document name and page number" },
  { icon: <Brain className="w-6 h-6" />, title: "AI Powered", desc: "Powered by LLaMA3 via Groq for fast intelligent responses" },
  { icon: <Zap className="w-6 h-6" />, title: "Collections", desc: "Organise documents into collections by specialty or topic" },
];

const steps = [
  { step: "01", title: "Upload Your Documents", desc: "Upload PDFs, paste URLs or add YouTube medical lectures to your collection" },
  { step: "02", title: "AI Processes Content", desc: "Our RAG pipeline chunks, embeds and indexes all your content intelligently" },
  { step: "03", title: "Ask and Get Answers", desc: "Chat naturally and get precise answers with exact source citations" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="w-7 h-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">MediQuery</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"><Button variant="ghost">Login</Button></Link>
          <Link to="/register"><Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">AI Powered Medical Knowledge Base</Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Chat With Your <span className="text-blue-600">Medical Documents</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Upload medical reports, research papers and clinical guidelines. Get instant AI answers with exact source citations — built for doctors and medical students.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
              Start for Free <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="px-8">Login</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-center text-gray-500 mb-12">Powerful features built for healthcare professionals</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
        <p className="text-center text-gray-500 mb-12">Get started in 3 simple steps</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-blue-100 mb-4">{s.step}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-blue-100 mb-8">Join doctors and medical students using MediQuery</p>
        <Link to="/register">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
            Create Free Account
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        <p>⚠️ MediQuery is for informational purposes only. Always consult a licensed medical professional.</p>
      </footer>
    </div>
  );
}