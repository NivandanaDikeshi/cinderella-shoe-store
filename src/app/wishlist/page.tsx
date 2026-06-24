"use client";

import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

import useWishlistStore from "@/store/wishlistStore";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 py-12 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            My Wishlist ❤️
          </h1>
          <p className="text-gray-500 mt-2">
            Save your favorite shoes and shop them anytime
          </p>
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">

            <div className="text-6xl mb-4">💔</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mt-2 max-w-md">
              Start adding shoes you love. Tap the heart icon while browsing products.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>

          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

              {items.map((product: any) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >

                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h3 className="font-bold text-lg text-gray-900">
                      {product.name}
                    </h3>

                    <p className="text-pink-600 font-extrabold text-lg mt-2">
                      LKR {Number(product.price).toLocaleString()}
                    </p>

                    {/* VIEW BUTTON */}
                    <Link
                      href={`/product/${product.id}`}
                      className="block mt-4 text-center bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-xl font-medium transition"
                    >
                      View Product
                    </Link>

                    {/* REMOVE BUTTON */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-full mt-3 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl font-medium transition"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </div>
    </div>
  );
}