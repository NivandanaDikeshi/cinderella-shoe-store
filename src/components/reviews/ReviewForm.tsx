"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { addReview } from "@/services/reviewService";

interface Props {
  productId: string;
  reloadReviews: () => void;
}

export default function ReviewForm({ productId, reloadReviews }: Props) {
  const { user } = useAuthStore();

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    if (!user) return setMsg("⚠️ Please login first");
    if (!comment.trim()) return setMsg("⚠️ Write a review first");

    try {
      setLoading(true);
      setMsg("");

      await addReview({
        productId,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || "",
        rating,
        comment,
        createdAt: new Date().toISOString(),
      });

      setComment("");
      setRating(5);

      reloadReviews(); // instant refresh
      setMsg("✅ Review submitted!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-white border border-gray-100 shadow-sm rounded-3xl p-6">

      <h3 className="text-2xl font-bold mb-4">
        Write a Review ✍️
      </h3>

      {/* MESSAGE */}
      {msg && (
        <div className="mb-4 text-sm bg-gray-50 border rounded-xl px-4 py-2 text-gray-700">
          {msg}
        </div>
      )}

      {/* STAR RATING */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          >
            <Star
              size={28}
              className={
                (hover || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}

        <span className="ml-2 text-sm text-gray-500">
          {rating}/5
        </span>
      </div>

      {/* COMMENT */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Share your experience..."
        className="w-full border rounded-2xl p-4 focus:ring-2 focus:ring-pink-400 outline-none"
      />

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-2xl font-semibold transition"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

    </div>
  );
}