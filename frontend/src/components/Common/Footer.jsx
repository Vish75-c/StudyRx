import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Brain, Github, Twitter, Linkedin, Mail,
  ShieldCheck, Globe, Scale, HeartPulse, Sparkles
} from "lucide-react";
import Logo from "../Logo";
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

  const socials = [
    { icon: <Twitter className="h-4 w-4" />, href: "#" },
    { icon: <Linkedin className="h-4 w-4" />, href: "#" },
    { icon: <Github className="h-4 w-4" />, href: "#" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white border-t border-slate-100 pt-16 pb-8"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
             <Link to="/" className="flex items-center gap-2.5  group">
                <Link to="/dashboard" className="flex items-center justify-center gap-1.5 group">
            <div className="flex items-center justify-center">
              <Logo className="h-7 w-7 text-white" />
            </div>
          </Link>
                <span className="text-2xl font-bold text-slate-900 font-[Syne]">
                  Study<span className="gradient-text">Rx</span>
                </span>
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
                  className="bg-slate-50 border-slate-200 focus-visible:ring-violet-200"
                />
                <Button className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 border-0 shadow-lg shadow-violet-200/30">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">{title}</h4>
              <ul className="space-y-2.5">
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

            {/* Compliance */}
           
          </div>

          {/* Disclaimer */}
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