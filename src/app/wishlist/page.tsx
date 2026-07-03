"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, Eye } from "lucide-react";
import useWishlistStore from "@/store/wishlistStore";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            My Wishlist ❤️
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Save your favorite shoes and shop them anytime.
          </p>
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white/70 backdrop-blur-md px-6 py-24 text-center shadow-xl">

            <div className="text-6xl mb-4">💔</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Start adding products you love by tapping the heart icon.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-pink-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-pink-700 hover:scale-105"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">

            {items.map((product: any) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-md shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-3">

                  <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <div className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">
                    LKR {Number(product.price).toLocaleString()}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2 pt-2">

                    {/* VIEW */}
                    <button
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="flex-1 flex items-center justify-center rounded-xl border border-pink-200 bg-pink-50 py-2.5 text-pink-600 transition hover:bg-pink-100 hover:border-pink-400 hover:scale-105"
                      title="View Product"
                    >
                      <Eye size={18} />
                    </button>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="flex items-center justify-center rounded-xl bg-red-50 px-4 py-2.5 text-red-500 transition hover:bg-red-100 hover:scale-105"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}