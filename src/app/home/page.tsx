"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { ShoppingBag, Package, LogOut, Sparkles } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">

      <div className="w-full max-w-3xl">

        {/* CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10 text-center relative overflow-hidden">

          {/* decorative blur circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

          {/* ICON */}
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-3xl shadow-lg">
            👠
          </div>

          {/* TITLE */}
          <h1 className="text-4xl font-extrabold text-gray-900 mt-6">
            Welcome Back 👋
          </h1>

          <p className="text-gray-600 mt-3 leading-relaxed">
            You are successfully logged in to{" "}
            <span className="font-semibold text-pink-600">
              Cinderella Shoe Store
            </span>.
            <br />
            Manage orders, explore collections, and enjoy your shopping experience.
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Link
              href="/shop"
              className="group flex flex-col items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-5 rounded-2xl shadow-md hover:scale-[1.03] transition"
            >
              <ShoppingBag className="group-hover:scale-110 transition" />
              <span className="font-semibold">Go to Shop</span>
            </Link>

            <Link
              href="/my-orders"
              className="group flex flex-col items-center gap-2 bg-white border border-gray-200 text-gray-700 py-5 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.03] transition"
            >
              <Package className="text-pink-500 group-hover:scale-110 transition" />
              <span className="font-semibold">My Orders</span>
            </Link>

            <button
              onClick={handleLogout}
              className="group flex flex-col items-center gap-2 bg-gray-900 text-white py-5 rounded-2xl shadow-md hover:bg-black hover:scale-[1.03] transition"
            >
              <LogOut className="group-hover:scale-110 transition" />
              <span className="font-semibold">Logout</span>
            </button>

          </div>

          {/* FOOTER */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Sparkles size={14} />
            Secure session • Powered by Firebase Auth
          </div>

        </div>
      </div>
    </div>
  );
}