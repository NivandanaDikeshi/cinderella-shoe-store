"use client";

import ProductForm from "@/components/products/ProductForm";
import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { useState, useEffect } from "react";

export default function CreateProductPage() {
  // Simple local toast implementation (replaces missing @/hooks/useToast)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSuccess = () => showToast("Product created successfully 🎉", "success");
  const handleError = () => showToast("Something went wrong ❌", "error");

  const ToastComponent = toast ? (
    <div className="fixed right-6 bottom-6 z-50">
      <div
        className={`py-2 px-4 rounded shadow-lg text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
      >
        {toast.message}
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* TOAST UI */}
      {ToastComponent}

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <PackagePlus className="text-gray-500" size={22} />
                Add Product
              </h1>
              <p className="text-sm text-slate-500">
                Create a new product for your store
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* FORM */}
      <div className="w-full px-6 py-6">
        {/* cast props to any to satisfy mismatched ProductForm prop types */}
        <ProductForm {...({ onSuccess: handleSuccess, onError: handleError } as any)} />
      </div>

    </div>
  );
}