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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-3xl border border-gray-200 bg-white/75 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8 lg:p-12">
          {/* decorative blur circles */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-300 opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-purple-300 opacity-30 blur-3xl" />

          {/* ICON */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-3xl text-white shadow-lg sm:h-24 sm:w-24">
            👠
          </div>

          {/* TITLE */}
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Welcome Back 👋
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
            You are successfully logged in to{" "}
            <span className="font-semibold text-pink-600">
              Cinderella Shoe Store
            </span>
            . Manage orders, explore collections, and enjoy your shopping
            experience.
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/shop"
              className="group flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-5 text-white shadow-md transition hover:scale-[1.02]"
            >
              <ShoppingBag className="transition group-hover:scale-110" />
              <span className="font-semibold">Go to Shop</span>
            </Link>

            <Link
              href="/my-orders"
              className="group flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-5 text-gray-700 shadow-sm transition hover:scale-[1.02] hover:shadow-md"
            >
              <Package className="text-pink-500 transition group-hover:scale-110" />
              <span className="font-semibold">My Orders</span>
            </Link>

            <button
              onClick={handleLogout}
              className="group flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-5 text-white shadow-md transition hover:scale-[1.02] hover:bg-black"
            >
              <LogOut className="transition group-hover:scale-110" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>

          {/* FOOTER */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-gray-400 sm:mt-10">
            <Sparkles size={14} />
            <span>Secure session • Powered by Firebase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}