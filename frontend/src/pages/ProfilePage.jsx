import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// API & Stores (Your original logic)
import { updatePassword, deleteAccount } from "@/utils/api";
import useAuthStore from "@/stores/authStore";

/** * UI COMPONENTS (From your Template)
 */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, type = "button", variant = "primary", disabled, className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
    destructive: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

const Input = React.forwardRef(({ ...props }, ref) => (
  <input
    ref={ref}
    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    {...props}
  />
));

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
    {children}
  </label>
);

/**
 * SCHEMA (Your original logic)
 */
const schema = z.object({
  currentPassword: z.string().min(6, "Minimum 6 characters"),
  newPassword: z.string().min(6, "Minimum 6 characters"),
});

/**
 * PAGE COMPONENT
 */
export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  // Logic: Original Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Logic: Original Password Update Handler
  const onSubmit = async (data) => {
    try {
      await updatePassword(data);
      toast.success("Password updated successfully");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  // Logic: Original Account Deletion Handler
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
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 text-left">Profile</h1>

        {/* User Info Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-sm text-slate-500 truncate">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>
        </Card>

        {/* Change Password Card */}
        <Card className="p-6 text-left">
          <div className="mb-5 flex items-center gap-2">
            <Lock className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">
              Change Password
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Card>

        {/* Danger Zone Card */}
        <Card className="border-red-200 bg-red-50 p-6 text-left">
          <div className="mb-3 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-bold text-red-900">
              Danger Zone
            </h2>
          </div>
          <p className="mb-4 text-sm text-red-700/80">
            Deleting your account is permanent and cannot be undone. All your collections and chats will be wiped.
          </p>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full shadow-sm"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </Card>
      </div>
    </div>
  );
}