import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/utils/api";
import useAuthStore from "@/stores/authStore";
import toast from "react-hot-toast";
import { 
  Brain, Github, Twitter, Linkedin, Mail, 
  ShieldCheck, Globe, Scale, HeartPulse 
} from "lucide-react";
// Replace with your local asset or a placeholder URL
import authIllustration from '../assests/auth-illustration.png'
import Footer from "@/components/Common/FooterAuth";
import AuthNavbar from "@/components/Common/NavbarAuth";

export default function LoginPage() {
    const currentYear = new Date().getFullYear();

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔍 Manual Validation Logic
  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✍️ Premium Input Handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Remove error while typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 🚀 Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const result = await loginUser(form);
      const payload = result?.data ?? result;
      const token = payload?.token;

      if (!token) throw new Error("Invalid response");

      localStorage.setItem("token", token);
      setAuth(payload.user ?? payload, token);

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AuthNavbar/>
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50" 
        style={{ background: 'radial-gradient(circle at 50% 50%, #3b82f615 0%, transparent 70%)' }}
      />

      {/* Left – Illustration (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        <img
          src={authIllustration}
          alt="MediQuery AI Analysis"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/80 via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center justify-end p-12 pb-20 w-full">
          <div className="text-center max-w-sm bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">
              AI-Powered Medical Insights
            </h2>
            <p className="text-blue-100 text-sm">
              Unlock the data within your medical records using secure, advanced RAG technology.
            </p>
          </div>
        </div>
      </div>

      {/* Right – Form Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm p-8 shadow-2xl">
            
            {/* Logo */}
            <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
              <div className="p-2 rounded-xl bg-blue-600 shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-200">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                Medi<span className="text-blue-600">Query</span>
              </span>
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 text-center">Welcome back</h1>
            <p className="text-slate-500 text-center mt-2 mb-8 font-medium">Sign in to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="doctor@hospital.com"
                  className={`bg-slate-50 border-slate-200 transition-all focus:ring-2 ${
                    errors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-blue-200"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                   <Label htmlFor="password" className="text-slate-700">Password</Label>
                   <Link to="#" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`bg-slate-50 border-slate-200 pr-10 transition-all focus:ring-2 ${
                      errors.password ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-blue-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-8">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline underline-offset-4">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
       
    </div>
    <Footer/>
    </>
  );
}