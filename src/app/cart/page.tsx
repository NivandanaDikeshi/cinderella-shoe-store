"use client";

import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import useCartStore from "@/store/cartStore";

export default function CartPage() {
  const { items, getTotal, removeFromCart } = useCartStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <h1 className="mb-8 text-3xl font-extrabold text-gray-900 sm:mb-10 sm:text-4xl">
          Shopping Cart 🛒
        </h1>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-20 text-center shadow-sm sm:py-24">
            <ShoppingBag size={56} className="mb-4 text-gray-300 sm:size-[60px]" />

            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500 sm:text-base">
              Start shopping to add your favorite shoes here.
            </p>

            <Link
              href="/shop"
              className="mt-6 rounded-xl bg-pink-600 px-6 py-3 font-medium text-white transition hover:bg-pink-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            {/* CART ITEMS */}
            <div className="space-y-5 lg:col-span-2 sm:space-y-6">
              {items.map((item: any) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-md transition hover:shadow-lg sm:flex-row sm:gap-5 sm:p-5"
                >
                  {/* IMAGE */}
                  <div className="h-24 w-full overflow-hidden rounded-xl bg-gray-100 sm:w-24 shrink-0">
                    {item.image || item.images?.[0] ? (
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Size: {item.size} • Color: {item.color || "N/A"}
                    </p>

                    <p className="mt-2 font-bold text-pink-600">
                      LKR {Number(item.price).toLocaleString()}
                    </p>

                    <div className="mt-3 text-sm font-medium text-gray-700">
                      Quantity: {item.quantity}
                    </div>
                  </div>

                  {/* REMOVE */}
                  <div className="flex justify-end sm:justify-start">
                    <button
                      onClick={() =>
                        removeFromCart(item.id, item.size, item.color)
                      }
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl bg-white p-6 shadow-md lg:sticky lg:top-24">
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="mb-3 flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>LKR {Number(getTotal()).toLocaleString()}</span>
                </div>

                <div className="mb-3 flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-pink-600">
                    LKR {Number(getTotal()).toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 block rounded-xl bg-pink-600 py-3 text-center font-semibold text-white transition hover:bg-pink-700"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}