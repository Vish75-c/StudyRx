import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Lock, Trash2, Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { updatePassword, deleteAccount } from "@/utils/api";
import useAuthStore from "@/stores/authStore";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const schema = z.object({
  currentPassword: z.string().min(6, "Minimum 6 characters"),
  newPassword: z.string().min(6, "Minimum 6 characters"),
});

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await updatePassword(data);
      toast.success("Password updated successfully");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteAccount();
      logout();
      navigate("/");
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 text-slate-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-2xl space-y-6"
      >
        <motion.h1 variants={fadeUp} className="text-2xl font-bold text-slate-900 text-left font-[Syne]">Profile</motion.h1>

        {/* User Info */}
        <motion.div variants={fadeUp} className="p-6 bg-white rounded-2xl border border-slate-100 card-glow">
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xl font-bold shadow-lg shadow-violet-200/50 ring-4 ring-violet-100">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-900 truncate">{user?.name || "User"}</p>
              <p className="text-sm text-slate-500 truncate">{user?.email || "No email available"}</p>
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div variants={fadeUp} className="p-6 bg-white rounded-2xl border border-slate-100 card-glow text-left">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <Lock className="h-4 w-4 text-violet-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 font-[Syne]">Change Password</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                {...register("currentPassword")}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all bg-slate-50/50"
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 font-medium">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                {...register("newPassword")}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all bg-slate-50/50"
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 font-medium">{errors.newPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          variants={fadeUp}
          className="p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-200/60 text-left"
        >
          <div className="mb-4 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-red-900 font-[Syne]">Danger Zone</h2>
          </div>
          <p className="mb-5 text-sm text-red-700/70 leading-relaxed">
            Deleting your account is permanent and cannot be undone. All your collections and chats will be wiped.
          </p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full py-2.5 bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-200/50 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Account
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}