import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Brain, Github, Twitter, Linkedin, Mail, 
  ShieldCheck, Globe, Scale, HeartPulse 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();


  return (
    <footer className="bg-white border-t border-slate-200 pb-8">
      <div className="container mx-auto px-6">
       

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