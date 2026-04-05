import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { loginUser } from "@/utils/api";
import useAuthStore from "@/stores/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔍 Validate manually
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

  // ✍️ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove error while typing (premium UX)
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 🚀 Submit
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Brain className="w-7 h-7 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            MediQuery
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Welcome back
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Sign in to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@hospital.com"
              className={`mt-1 transition focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-200"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`mt-1 transition focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-200"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}