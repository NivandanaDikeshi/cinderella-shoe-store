"use client";

import { useState } from "react";
import useCartStore from "@/store/cartStore";
import ProductRating from "./ProductRating";

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
      image: product.images?.[0] || "",
      size,
      color,
      quantity: qty,
    });

    setQty(1);
  };

  return (
    <div>
      {/* Title */}
      <h1 className="text-4xl font-bold">{product.name}</h1>

      {/* Price */}
      <p className="text-pink-600 text-2xl font-bold mt-2">
        LKR {product.price}
      </p>

      {/* Rating */}
      <div className="mt-3">
        <ProductRating productId={product.id} />
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-600">{product.description}</p>

      {/* Sizes */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Size</h3>
        <div className="flex flex-wrap gap-2">
          {product.sizes?.length ? (
            product.sizes.map((s: string) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 border rounded-lg transition ${
                  size === s
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white"
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

      {/* Colors */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Color</h3>
        <div className="flex flex-wrap gap-2">
          {product.colors?.length ? (
            product.colors.map((c: string) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 border rounded-lg transition ${
                  color === c
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white"
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

      {/* Quantity */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Quantity</h3>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) =>
            setQty(Math.max(1, Number(e.target.value)))
          }
          className="border rounded-lg p-2 w-24"
        />
      </div>

      {/* Stock */}
      {typeof product.stock === "number" && (
        <div className="mt-4 text-sm text-gray-500">
          Available Stock: {product.stock}
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={addToCart}
        className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition"
      >
        Add To Cart
      </button>
    </div>
  );
}