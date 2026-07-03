"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import useCartStore from "@/store/cartStore";

export default function CartPage() {
  const { items, getTotal, removeFromCart, updateCartItem } =
    useCartStore() as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Shopping Cart 🛒
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review your selected items before checkout.
          </p>
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white/70 backdrop-blur-md px-6 py-24 text-center shadow-xl">

            <div className="text-6xl mb-4">🛒</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Looks like you haven’t added anything yet.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-pink-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-pink-700 hover:scale-105"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-6">

              {items.map((item: any) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="group flex gap-5 rounded-3xl bg-white/80 backdrop-blur-md p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >

                  {/* IMAGE */}
                  <img
                    src={item.image}
                    className="h-28 w-28 rounded-2xl object-cover"
                  />

                  {/* DETAILS */}
                  <div className="flex-1 space-y-2">

                    <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {item.name}
                    </h2>

                    <div className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">
                      LKR {item.price}
                    </div>

                    {/* SIZE */}
                    {item.sizes?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mt-2">Sizes</p>

                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.sizes.map((s: string) => (
                            <button
                              key={s}
                              onClick={() =>
                                updateCartItem(item.id, item.size, item.color, {
                                  size: s,
                                })
                              }
                              className={`px-3 py-1 rounded-xl text-xs border transition ${
                                item.size === s
                                  ? "bg-pink-600 text-white border-pink-600"
                                  : "hover:border-pink-400"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* COLOR */}
                    {item.colors?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mt-2">Colors</p>

                        <div className="flex gap-2 mt-1">
                          {item.colors.map((c: string) => (
                            <button
                              key={c}
                              onClick={() =>
                                updateCartItem(item.id, item.size, item.color, {
                                  color: c,
                                })
                              }
                              className={`h-6 w-6 rounded-full border-2 transition ${
                                item.color === c
                                  ? "border-black scale-110"
                                  : "border-gray-300"
                              }`}
                              style={{ backgroundColor: c.toLowerCase() }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 pt-2">

                      {/* MINUS (cannot go below 1) */}
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateCartItem(item.id, item.size, item.color, {
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className={`rounded-xl border p-2 transition ${
                          item.quantity <= 1
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-pink-50"
                        }`}
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      {/* PLUS */}
                      <button
                        onClick={() =>
                          updateCartItem(item.id, item.size, item.color, {
                            quantity: item.quantity + 1,
                          })
                        }
                        className="rounded-xl border p-2 hover:bg-pink-50 transition"
                      >
                        <Plus size={16} />
                      </button>

                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.size, item.color)
                    }
                    className="rounded-xl bg-red-50 px-3 py-2 text-red-500 transition hover:bg-red-100 hover:scale-105"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 shadow-md h-fit">

              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Order Summary
              </h2>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Total</span>
                <span className="text-pink-600 font-bold text-lg">
                  LKR {getTotal()}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block rounded-2xl bg-pink-600 py-3 text-center font-medium text-white shadow-md transition hover:bg-pink-700 hover:scale-105"
              >
                Checkout
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}