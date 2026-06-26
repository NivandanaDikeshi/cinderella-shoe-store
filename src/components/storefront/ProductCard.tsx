"use client";

import { useState } from "react";

export default function ProductClient({ product }: any) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const submitReview = () => {
    if (!rating || !review) {
      alert("Please add rating and review");
      return;
    }

    // 🔥 later connect Firebase here
    console.log("Product ID:", product.id);
    console.log("Rating:", rating);
    console.log("Review:", review);

    alert("Review submitted successfully!");
    setRating(0);
    setReview("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* PRODUCT INFO */}
      <div className="border rounded-xl p-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>

        {product.price && (
          <p className="mt-2 text-lg font-semibold">
            Rs. {product.price}
          </p>
        )}
      </div>

      {/* ⭐ RATING SECTION */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg">Rate this product</h2>

        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* ✍️ REVIEW INPUT */}
      <div className="mt-6">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full border rounded p-3 h-28"
        />
      </div>

      {/* SUBMIT */}
      <button
        onClick={submitReview}
        className="mt-4 bg-black text-white px-5 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
}