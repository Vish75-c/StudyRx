import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword, deleteAccount } from "@/utils/api";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock, Trash2 } from "lucide-react";

const schema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

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
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>

      {/* User Info */}
      <Card className="p-6 border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-6 border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Change Password</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" {...register("currentPassword")} className="mt-1" />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">Minimum 6 characters</p>}
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" placeholder="••••••••" {...register("newPassword")} className="mt-1" />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">Minimum 6 characters</p>}
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-100 bg-red-50">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-red-700">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-600 mb-4">Deleting your account is permanent and cannot be undone.</p>
        <Button onClick={handleDelete} variant="destructive" disabled={deleting}>
          {deleting ? "Deleting..." : "Delete Account"}
        </Button>
      </Card>
    </div>
  );
}