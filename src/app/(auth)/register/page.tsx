"use client";

import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "This email is already registered. Redirecting to login...",
  "auth/invalid-email": "Invalid email format.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/missing-password": "Please enter a password.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!auth) {
      setError("Something went wrong on our end. Please try again shortly.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        role: "user",
        roleCode: 99,
        createdAt: serverTimestamp(),
      });

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err: any) {
      const code = err?.code as string | undefined;

      if (code === "auth/email-already-in-use") {
        setError(ERROR_MESSAGES[code]);
        setTimeout(() => router.push("/login"), 1200);
        setLoading(false);
        return;
      }

      setError(
        (code && ERROR_MESSAGES[code]) ||
          "Registration failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2">
            Join Cinderella Shoe Store and start shopping
          </p>
        </div>

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

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-3.5 text-pink-500" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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

            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3.5 text-pink-500" size={18} />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <UserPlus size={18} />
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-600 font-semibold hover:underline">
              Login
            </Link>
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