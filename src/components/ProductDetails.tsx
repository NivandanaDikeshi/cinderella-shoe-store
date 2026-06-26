"use client";

import { useState } from "react";

export default function ProductDetails({ product }: any) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const submitReview = () => {
    console.log("Rating:", rating);
    console.log("Review:", review);

    // 👉 later connect Firebase / API here
    alert("Review submitted!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Product Info */}
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-500">{product.description}</p>

      {/* ⭐ Rating */}
      <div className="mt-6">
        <h2 className="font-semibold">Rate this product</h2>

        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* ✍️ Review */}
      <div className="mt-6">
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>

      {/* Submit */}
      <button
        onClick={submitReview}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
}