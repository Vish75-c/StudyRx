import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";

export default function AuthNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 shadow-lg shadow-violet-200">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">MediQuery</span>
          </Link>
          
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
  );
}