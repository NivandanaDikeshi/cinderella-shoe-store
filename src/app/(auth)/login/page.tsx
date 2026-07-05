"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password. Please try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
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

      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("We couldn't find a profile for this account. Contact support.");
        setLoading(false);
        return;
      }

      const roleCode = userSnap.data().roleCode;

      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        if (roleCode === 0 || roleCode === 1) {
          router.push("/admin/dashboard");
          return;
        }
        router.push("/home");
      }, 600);
    } catch (err: any) {
      const code = err?.code as string | undefined;
      setError(
        (code && ERROR_MESSAGES[code]) ||
          "Something went wrong while logging in. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Login to continue to your account
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8">
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

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3.5 text-pink-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>

              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3.5 text-pink-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <LogIn size={18} />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* LINKS */}
          <div className="mt-6 text-center text-sm space-y-2">
            <p>
              Don't have an account?{" "}
              <Link href="/register" className="text-pink-600 font-semibold">
                Register
              </Link>
            </p>

            <p>
              Admin access?{" "}
              <Link href="/admin/login" className="text-pink-600 font-semibold">
                Admin Login
              </Link>
            </p>
          </div>
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