"use client";

import { useState } from "react";
import { addReview } from "@/services/reviewService";
import { useAuthStore } from "@/store/authStore";

export default function ReviewForm({
  productId,
  reloadReviews,
}: any) {
  const { user } = useAuthStore();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    if (!productId) return setMsg("❌ Missing product ID");
    if (!user) return setMsg("⚠️ Please login first");
    if (!comment.trim()) return setMsg("⚠️ Write a comment");

    try {
      setLoading(true);

      await addReview({
        productId,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || "",
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      });

      setComment("");
      setRating(5);

      await reloadReviews();

      setMsg("✅ Review submitted!");
    } catch (err) {
      setMsg("❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-white">
      <p className="text-sm text-gray-600">{msg}</p>

      {/* STARS */}
      <div className="flex gap-2 mt-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setRating(s)}
            className={`text-2xl ${
              s <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* COMMENT */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border mt-3 p-2 rounded"
        placeholder="Write your review..."
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 bg-pink-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}