// src/app/checkout/cancel/page.tsx
"use client";

import Link from "next/link";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg border border-gray-100 p-8 md:p-10 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <XCircle className="h-14 w-14 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
          Your checkout was cancelled and no payment was completed.
          If this was a mistake, you can return to your cart and try again.
        </p>

        {/* Info box */}
        <div className="mt-6 rounded-xl bg-red-50 border border-red-100 p-4 text-left">
          <p className="text-sm md:text-base text-red-700">
            <span className="font-semibold">Note:</span> Your items may still be
            in the cart depending on how your cart is stored. You can review your
            cart and continue checkout anytime.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-white font-medium hover:bg-gray-800 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Cart
          </Link>

          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-gray-800 font-medium hover:bg-gray-50 transition"
          >
            <ShoppingBag className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}