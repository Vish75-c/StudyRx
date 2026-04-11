import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function AuthNavbar() {
  return (
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
          <span className="text-lg font-bold tracking-tight text-slate-900 font-[Syne]">Medic.AI</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-violet-600" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 text-white border-0" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}