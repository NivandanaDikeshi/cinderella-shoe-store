"use client";

import { useState } from "react";
import useCartStore from "@/store/cartStore";
import ProductRating from "./ProductRating";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export default function ProductInfo({ product }: any) {
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  const addToCartStore = useCartStore((state) => state.addToCart);

  const addToCart = () => {
    if (!product) return;

    if (!size) return alert("Please select a size");
    if (!color) return alert("Please select a color");

    addToCartStore({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] || "/placeholder.jpg",

      size,
      color,
      quantity: qty,

      // ✅ FIX: REQUIRED FIELDS ADDED
      sizes: product.sizes || [],
      colors: product.colors || [],
    });

    setQty(1);
  };

  const increaseQty = () => setQty((prev) => prev + 1);
  const decreaseQty = () => setQty((prev) => Math.max(1, prev - 1));

  return (
    <div className="w-full">

      {/* TITLE */}
      <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
        {product.name}
      </h1>

      {/* PRICE */}
      <p className="mt-3 text-2xl font-bold text-pink-600 sm:text-3xl">
        LKR {Number(product.price).toLocaleString()}
      </p>

      {/* RATING */}
      <div className="mt-3">
        <ProductRating productId={product.id} />
      </div>

      {/* DESCRIPTION */}
      <p className="mt-5 text-sm text-gray-600 sm:text-base">
        {product.description || "No description available for this product."}
      </p>

      {/* SIZE */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-800">
          Size
        </h3>

        <div className="flex flex-wrap gap-2">
          {product.sizes?.length ? (
            product.sizes.map((s: string) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 rounded-xl border transition ${
                  size === s
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white text-gray-700 hover:border-pink-400"
                }`}
              >
                {s}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-400">No sizes available</p>
          )}
        </div>
      </div>

      {/* COLOR */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-800">
          Color
        </h3>

        <div className="flex flex-wrap gap-2">
          {product.colors?.length ? (
            product.colors.map((c: string) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded-xl border transition ${
                  color === c
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white text-gray-700 hover:border-pink-400"
                }`}
              >
                {c}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-400">No colors available</p>
          )}
        </div>
      </div>

      {/* QUANTITY */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-800">
          Quantity
        </h3>

        <div className="flex items-center justify-between w-[170px] border rounded-xl px-3 py-2">
          <button onClick={decreaseQty}>
            <Minus size={18} />
          </button>

          <span className="font-semibold">{qty}</span>

          <button onClick={increaseQty}>
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* STOCK */}
      {typeof product.stock === "number" && (
        <div className="mt-5 text-sm text-gray-500">
          Available Stock:{" "}
          <span className="font-semibold text-gray-700">
            {product.stock}
          </span>
        </div>
      )}

      {/* ADD TO CART */}
      <button
        onClick={addToCart}
        className="mt-8 flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700"
      >
        <ShoppingCart size={18} />
        Add To Cart
      </button>
    </div>
  );
}