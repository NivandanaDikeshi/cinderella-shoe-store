"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 md:p-10 bg-[#f4f5f7]">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-600">
          <ShieldAlert size={32} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Access Denied
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your staff account does not have the required permissions to view this section. Please contact your system administrator if you believe this is an error.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow transition-all hover:bg-gray-800 active:scale-95"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
