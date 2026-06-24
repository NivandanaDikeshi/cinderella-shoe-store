"use client";

import ProductForm from "@/components/products/ProductForm";
import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";

export default function CreateProductPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-pink-50">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-pink-100 px-6 py-5">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="p-2 rounded-lg border border-pink-200 hover:bg-pink-50 transition"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <PackagePlus className="text-pink-500" size={22} />
                Add Product
              </h1>
              <p className="text-sm text-slate-500">
                Create a new product for your store
              </p>
            </div>
          </div>

          <Link
            href="/admin/products"
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-pink-600 transition"
          >
            Back to Products
          </Link>

        </div>
      </div>

      {/* FORM CONTAINER (FULL WIDTH) */}
      <div className="w-full px-6 py-6">
        <ProductForm />
      </div>

    </div>
  );
}