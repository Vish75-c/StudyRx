import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Brain, Github, Twitter, Linkedin, Mail, 
  ShieldCheck, Globe, Scale, HeartPulse 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Use Cases", href: "#use-cases" },
      { name: "Security", href: "#security" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Medical Research", href: "#" },
      { name: "Community", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "HIPAA Compliance", href: "#" },
    ],
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 shadow-md">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MediQuery</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              The intelligent RAG platform designed for healthcare professionals. 
              Securely query medical documents, research, and guidelines with AI-driven precision.
            </p>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Subscribe to updates</h4>
              <div className="flex gap-2 max-w-sm">
                <Input 
                  type="email" 
                  placeholder="doctor@hospital.com" 
                  className="bg-slate-50 border-slate-200 focus-visible:ring-violet-500"
                />
                <Button className="bg-violet-600 hover:bg-violet-700 text-white px-4">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-slate-500 hover:text-violet-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Socials & Copyright */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-4">
                <Link to="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link to="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link to="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                © {currentYear} MediQuery AI. All rights reserved. Built with 
                <HeartPulse className="h-3 w-3 inline mx-1 text-red-400" /> for healthcare.
              </p>
            </div>

            {/* Compliance Badges */}
            <div className="flex items-center gap-6 opacity-60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <ShieldCheck className="h-4 w-4 text-violet-600" />
                HIPAA READY
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Globe className="h-4 w-4 text-violet-600" />
                GDPR COMPLIANT
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Scale className="h-4 w-4 text-violet-600" />
                SOC2 TYPE II
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-12 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 text-center mb-1">
              Medical Disclaimer
            </p>
            <p className="text-xs text-slate-400 text-center italic leading-relaxed max-w-4xl mx-auto">
              MediQuery is an AI-powered informational tool designed to assist healthcare professionals in navigating 
              their own documents. It does not provide medical advice, diagnosis, or treatment recommendations. 
              Always rely on primary sources and professional clinical judgment for patient care decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}