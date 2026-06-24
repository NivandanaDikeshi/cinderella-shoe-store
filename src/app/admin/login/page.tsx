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
import { Eye, EyeOff, Shield, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminData, clearAdminData } = useAdminAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error("User not found.");
      }

      const userData = userSnap.data();
      const roleCode = userData.roleCode;

      if (roleCode !== 0 && roleCode !== 1) {
        await signOut(auth);
        clearAdminData();
        throw new Error("Access denied. Admins only.");
      }

      setAdminData(
        firebaseUser,
        userData.roleName || "admin",
        roleCode,
        userData.permissions || []
      );

      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error(error);
      clearAdminData();
      alert(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-gradient-to-br from-pink-100 via-pink-50 to-white">

      {/* soft pink glow */}
      <div className="absolute w-[500px] h-[500px] bg-pink-300/40 blur-[140px] top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-rose-300/30 blur-[140px] bottom-[-150px] right-[-150px]" />

      {/* Card */}
      <div className="w-full max-w-md z-10">
        <div className="rounded-3xl border border-pink-200 bg-white/80 backdrop-blur-xl shadow-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center mb-4 shadow-md">
              <Shield className="text-white" size={22} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Cinderella Admin
            </h1>

            <p className="text-xs text-pink-500 mt-2 tracking-[0.35em] uppercase">
              Secure Login Portal
            </p>
          </div>

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
                className="mt-2 w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white text-gray-900 outline-none pr-12 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 transition shadow-lg disabled:opacity-60"
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
    </div>
  );
}