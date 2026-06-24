"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import useCartStore from "@/store/cartStore";

export default function CartPage() {
  const { items, getTotal, removeFromCart } = useCartStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 py-12 px-4">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
          Shopping Cart 🛒
        </h1>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm py-24 text-center">

            <ShoppingBag size={60} className="text-gray-300 mb-4" />

            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Start shopping to add items here
            </p>

            <Link
              href="/shop"
              className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">

              {items.map((item: any) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-5 bg-white rounded-3xl shadow-md hover:shadow-lg transition p-5"
                >

                  {/* IMAGE (FIXED) */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    {item.image || item.images?.[0] ? (
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No Image
                      </span>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">

                    <h3 className="font-bold text-lg text-gray-900">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Size: {item.size} • Color: {item.color}
                    </p>

                    <p className="text-pink-600 font-bold mt-2">
                      LKR {item.price}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-4">
                      <span className="font-medium">
                        Quantity: {item.quantity}
                      </span>
                    </div>

                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.size, item.color)
                    }
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              ))}

            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-1">

              <div className="bg-white rounded-3xl shadow-md p-6 sticky top-24">

                <h2 className="text-xl font-bold mb-5">
                  Order Summary
                </h2>

                <div className="flex justify-between text-gray-600 mb-3">
                  <span>Subtotal</span>
                  <span>LKR {getTotal()}</span>
                </div>

                <div className="flex justify-between text-gray-600 mb-3">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-pink-600">
                    LKR {getTotal()}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block mt-6 bg-pink-600 hover:bg-pink-700 text-white text-center py-3 rounded-xl font-semibold transition"
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