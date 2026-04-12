import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Logo from "../Logo";
export default function AuthNavbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-slate-200/80 glass"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/dashboard" className="flex items-center gap-1.5 group">
            <div className="flex items-center justify-center">
              <Logo className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 font-[Syne]">StudyRx</span>
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