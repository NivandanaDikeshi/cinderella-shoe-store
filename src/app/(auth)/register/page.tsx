"use client";

import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!auth) {
      alert("Firebase auth is not available.");
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

      alert("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      console.error("Register error:", error);

      const code = error?.code;

      if (code === "auth/email-already-in-use") {
        alert("This email is already registered. Please login instead.");
        router.push("/login");
        return;
      }

      if (code === "auth/invalid-email") {
        alert("Invalid email format.");
        return;
      }

      if (code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
        return;
      }

      if (code === "auth/missing-password") {
        alert("Please enter a password.");
        return;
      }

      alert("Registration failed. Please try again.");
    } finally {
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
    </div>
  );
}