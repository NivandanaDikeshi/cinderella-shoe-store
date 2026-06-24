"use client";

import { useState } from "react";
import useCartStore from "@/store/cartStore";
import ProductRating from "./ProductRating";

export default function ProductInfo({
  product,
}: any) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);

  const addToCartStore = useCartStore(
    (state) => state.addToCart
  );

  const addToCart = () => {
    if (!size) {
      alert("Please select a size");
      return;
    }

    if (!color) {
      alert("Please select a color");
      return;
    }

    addToCartStore({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] || "",
      size,
      color,
      quantity: qty,
    });

    alert("Product added to cart successfully");

    setQty(1);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold">
        {product.name}
      </h1>

      <p className="text-pink-600 text-2xl font-bold mt-2">
        LKR {product.price}
      </p>

      <p className="mt-4 text-gray-600">
        {product.description}
      </p>

      {/* Sizes */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">
          Size
        </h3>

        <div className="flex flex-wrap gap-2">
          {product.sizes?.map(
            (s: string) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setSize(s)
                }
                className={`px-4 py-2 border rounded-lg transition ${
                  size === s
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white"
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
      </div>
      <h1 className="text-4xl font-bold">
      {product.name}
      </h1>

      <ProductRating
      productId={product.id}
      />
      
      {/* Colors */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">
          Color
        </h3>

        <div className="flex flex-wrap gap-2">
          {product.colors?.map(
            (c: string) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  setColor(c)
                }
                className={`px-4 py-2 border rounded-lg transition ${
                  color === c
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white"
                }`}
              >
                {c}
              </button>
            )
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">
          Quantity
        </h3>

        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) =>
            setQty(
              Math.max(
                1,
                Number(
                  e.target.value
                )
              )
            )
          }
          className="border rounded-lg p-2 w-24"
        />
      </div>

      {/* Stock */}
      {product.stock && (
        <div className="mt-4 text-sm text-gray-500">
          Available Stock:
          {" "}
          {product.stock}
        </div>
      )}

      {/* Add To Cart */}
      <button
        type="button"
        onClick={addToCart}
        className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition"
      >
        Add To Cart
      </button>
    </div>
  );
}