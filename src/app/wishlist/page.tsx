"use client";

import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import useWishlistStore from "@/store/wishlistStore";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Wishlist ❤️
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Save your favorite shoes and shop them anytime.
          </p>
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mb-4 text-5xl sm:text-6xl">💔</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500 sm:text-base">
              Start adding shoes you love. Tap the heart icon while browsing
              products.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-medium text-white transition hover:bg-pink-700"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product: any) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-lg font-extrabold text-pink-600">
                    LKR {Number(product.price).toLocaleString()}
                  </p>

                  <Link
                    href={`/product/${product.id}`}
                    className="mt-4 block rounded-xl bg-pink-600 py-2.5 text-center font-medium text-white transition hover:bg-pink-700"
                  >
                    View Product
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}