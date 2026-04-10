import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Brain, Eye, EyeOff, Heart, Shield, FileText, Activity, Sparkles, ArrowRight } from "lucide-react";
import authIllustration from "../assests/auth-illustration.png";
import { registerUser } from "@/utils/api";
import useAuthStore from "@/stores/authStore";
import toast from "react-hot-toast";
import Footer from "@/components/Common/FooterAuth";
import AuthNavbar from "@/components/Common/NavbarAuth";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

function FloatingIcons() {
  const icons = [
    { icon: <Heart className="h-5 w-5" />, x: "15%", y: "20%", delay: 0 },
    { icon: <Shield className="h-5 w-5" />, x: "80%", y: "25%", delay: 1 },
    { icon: <FileText className="h-5 w-5" />, x: "70%", y: "65%", delay: 2 },
    { icon: <Activity className="h-5 w-5" />, x: "20%", y: "70%", delay: 1.5 },
    { icon: <Sparkles className="h-4 w-4" />, x: "50%", y: "15%", delay: 0.5 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {icons.map((s, i) => (
        <motion.div
          key={i}
          className="absolute text-white/20"
          style={{ left: s.x, top: s.y }}
          animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          {s.icon}
        </motion.div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const result = await registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      const payload = result?.data ?? result;
      const token = payload?.token;
      if (!token) throw new Error("Token missing from registration response");
      localStorage.setItem("token", token);
      setAuth(payload.user ?? payload, token);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthNavbar />
      <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">

        {/* Left — Animated Gradient Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img src={authIllustration} alt="MediQuery AI" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/80 via-indigo-600/70 to-purple-700/80" />

          <FloatingIcons />

          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-mesh" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl animate-mesh" style={{ animationDelay: "7s" }} />

          <div className="relative z-10 flex flex-col items-center justify-end p-12 pb-20 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-center max-w-sm glass-dark rounded-2xl p-7 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-2 font-[Syne]">
                AI-Powered Medical Insights
              </h2>
              <p className="text-violet-200 text-sm leading-relaxed">
                Chat with your medical documents using advanced RAG technology to get instant answers.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="w-full max-w-md"
          >
            <motion.div variants={fadeUp} className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-8 shadow-2xl shadow-slate-200/50 card-glow">

              {/* Logo */}
              <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200 group-hover:scale-105 transition-transform duration-200">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900 font-[Syne]">
                  Medi<span className="gradient-text">Query</span>
                </span>
              </Link>

              <motion.h1 variants={fadeUp} className="text-2xl font-bold text-slate-900 text-center font-[Syne]">Create your account</motion.h1>
              <motion.p variants={fadeUp} className="text-slate-500 text-center mt-2 mb-8">Start chatting with your medical documents</motion.p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <motion.div variants={fadeUp} className="space-y-1.5">
                  <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                  <Input
                    id="name" name="name" value={form.name} onChange={handleChange}
                    placeholder="Dr. Jane Smith"
                    className={`bg-slate-50/80 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-violet-200"}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeUp} className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email" name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="jane@hospital.com"
                    className={`bg-slate-50/80 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-violet-200"}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp} className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password" name="password" type={showPassword ? "text" : "password"}
                      value={form.password} onChange={handleChange} placeholder="••••••••"
                      className={`bg-slate-50/80 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-violet-200"}`}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-violet-600 transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={fadeUp} className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword} onChange={handleChange} placeholder="••••••••"
                      className={`bg-slate-50/80 pr-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 focus-visible:ring-violet-200"}`}
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-violet-600 transition-colors">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Button
                    type="submit" disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-200/50 transition-all active:scale-[0.98] border-0 group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.p variants={fadeUp} className="text-center text-sm text-slate-500 mt-8">
                Already have an account?{" "}
                <Link to="/login" className="text-violet-600 font-semibold hover:underline underline-offset-4">
                  Sign in
                </Link>
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}