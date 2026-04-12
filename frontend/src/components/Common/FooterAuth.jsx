import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Github, Twitter, Linkedin,
  ShieldCheck, Globe, Scale, HeartPulse, Sparkles
} from "lucide-react";

export default function FooterAuth() {
  const currentYear = new Date().getFullYear();

  const socials = [
    { icon: <Twitter className="h-4 w-4" />, href: "#" },
    { icon: <Linkedin className="h-4 w-4" />, href: "#" },
    { icon: <Github className="h-4 w-4" />, href: "#" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white border-t border-slate-100 pb-8"
    >
      <div className="container mx-auto px-6">
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                {socials.map((s, i) => (
                  <Link
                    key={i}
                    to={s.href}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-all border border-transparent hover:border-violet-100"
                  >
                    {s.icon}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                © {currentYear} StudyRx. All rights reserved. Built with
                <HeartPulse className="h-3 w-3 inline mx-1 text-red-400" /> for healthcare.
              </p>
            </div>

            
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-linear-to-r from-slate-50 to-violet-50/30 border border-slate-100">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 text-center mb-1.5 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" /> Medical Disclaimer
            </p>
            <p className="text-xs text-slate-400 text-center italic leading-relaxed max-w-4xl mx-auto">
              StudyRx is an AI-powered informational tool designed to assist healthcare professionals in navigating
              their own documents. It does not provide medical advice, diagnosis, or treatment recommendations.
              Always rely on primary sources and professional clinical judgment for patient care decisions.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}