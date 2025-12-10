"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { AlertTriangle } from "lucide-react";

import { ErrorAlert } from "@/components/ui/error-alert";
import { FormInput } from "@/components/ui/form-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { SuccessAlert } from "@/components/ui/success-alert";

import { useToast } from "@/contexts/toast-context";

import { createClient } from "@/lib/supabase/client";

interface AccountSettingsProps {
  userEmail: string;
  initialName: string;
}

export function AccountSettings({ userEmail, initialName }: AccountSettingsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const supabase = createClient();

  const [profileName, setProfileName] = useState(initialName);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleProfileUpdate = async () => {
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: profileName },
    });

    if (error) {
      setProfileError(error.message);
      showToast({ type: "error", message: "Update failed", description: error.message });
    } else {
      setProfileSuccess(true);
      showToast({ type: "success", message: "Profile updated" });
      setTimeout(() => setProfileSuccess(false), 3000);
    }
    setProfileSaving(false);
  };

  const handlePasswordChange = async () => {
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match");
      showToast({ type: "error", message: "Passwords do not match" });
      setPasswordSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      showToast({ type: "error", message: "Password too short" });
      setPasswordSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError(error.message);
      showToast({ type: "error", message: "Update failed", description: error.message });
    } else {
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmNewPassword("");
      showToast({ type: "success", message: "Password updated" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setPasswordSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setDeleteError("Please type DELETE to confirm");
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete account");
        setDeleting(false);
        return;
      }

      router.push("/?deleted=true");
    } catch {
      setDeleteError("An error occurred. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-extralight tracking-wide mb-6">Account Settings</h2>

      <div className="border border-border p-6">
        <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-6">
          Personal Information
        </h3>

        {profileSuccess && <SuccessAlert message="Profile updated successfully" className="mb-4" />}
        {profileError && <ErrorAlert message={profileError} className="mb-4" />}

        <div className="grid md:grid-cols-2 gap-6">
          <FormInput
            label="Name"
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="py-3"
          />
          <FormInput
            label="Email"
            type="email"
            value={userEmail}
            disabled
            className="py-3 text-muted-foreground"
          />
        </div>
        <button
          onClick={handleProfileUpdate}
          disabled={profileSaving}
          className="mt-6 bg-foreground text-background px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {profileSaving ? <Spinner /> : "Save Changes"}
        </button>
      </div>

      <div className="border border-border p-6">
        <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-6">
          Change Password
        </h3>

        {passwordSuccess && (
          <SuccessAlert message="Password updated successfully" className="mb-4" />
        )}
        {passwordError && <ErrorAlert message={passwordError} className="mb-4" />}

        <div className="space-y-4 max-w-md">
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="py-3"
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="py-3"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          disabled={passwordSaving || !newPassword || !confirmNewPassword}
          className="mt-6 bg-foreground text-background px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {passwordSaving ? <Spinner /> : "Update Password"}
        </button>
      </div>

      <div className="border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-red-500 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              Once you delete your account, there is no going back. All your data will be
              permanently removed.
            </p>
          </div>
        </div>

        {deleteError && <ErrorAlert message={deleteError} className="mb-4" />}

        <div className="max-w-md">
          <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
            Type DELETE to confirm
          </label>
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            className="w-full px-0 py-3 bg-transparent border-0 border-b border-red-300 focus:border-red-500 outline-none text-sm font-light transition-colors"
            placeholder="DELETE"
          />
        </div>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting || deleteConfirm !== "DELETE"}
          className="mt-6 px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {deleting ? <Spinner className="border-red-500/30 border-t-red-500" /> : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
