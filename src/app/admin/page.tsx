"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { Eye, EyeOff, Shield, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password. Please try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminData, clearAdminData } = useAdminAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await signOut(auth);
        setError("No account found for this login. Please contact support.");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const roleCode = userData.roleCode;

      if (roleCode !== 0 && roleCode !== 1) {
        await signOut(auth);
        clearAdminData();
        setError("Access denied. This account doesn't have admin permissions.");
        setLoading(false);
        return;
      }

      setAdminData(
        firebaseUser,
        userData.roleName || "admin",
        roleCode,
        userData.permissions || []
      );

      setSuccess("Access granted. Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 600);
    } catch (err: any) {
      clearAdminData();
      const code = err?.code as string | undefined;
      setError(
        (code && ERROR_MESSAGES[code]) ||
          "Invalid credentials. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* soft gray glow */}
      <div className="absolute w-[500px] h-[500px] bg-gray-300/40 blur-[140px] top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-gray-300/30 blur-[140px] bottom-[-150px] right-[-150px]" />

      {/* Card */}
      <div className="w-full max-w-md z-10">
        <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-500 to-rose-400 flex items-center justify-center mb-4 shadow-md">
              <Shield className="text-white" size={22} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Cinderella Admin
            </h1>

            <p className="text-xs text-gray-500 mt-2 tracking-[0.35em] uppercase">
              Secure Login Portal
            </p>
          </div>

          {/* ERROR BANNER */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 animate-[fadeIn_0.2s_ease-out]">
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          {/* SUCCESS BANNER */}
          {success && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 animate-[fadeIn_0.2s_ease-out]">
              <CheckCircle2 size={17} className="shrink-0 mt-0.5" />
              <p className="leading-snug">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs text-gray-600">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cinderella.com"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-600">Password</label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none pr-12 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-500 to-rose-400 hover:from-gray-600 hover:to-rose-500 transition shadow-lg disabled:opacity-60"
            >
              <Lock size={18} />
              {loading ? "Signing in..." : "Access Admin Panel"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Authorized access only • Cinderella System
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}