"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Star } from "lucide-react";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  const submitReview = async () => {
    if (!user) return setMessage("⚠️ Please login first");
    if (rating === 0) return setMessage("⚠️ Please select rating");

    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        rating,
        comment,
        createdAt: serverTimestamp(),
      });

      setMessage("✅ Review submitted successfully!");

      setRating(0);
      setComment("");
      setHover(0);
    } catch (error) {
      console.log(error);
      setMessage("❌ Failed to submit review");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-gray-100 px-4">

      {/* CARD */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Rate Your Experience
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Share your feedback with others
        </p>

        {/* MESSAGE */}
        {message && (
          <div className="mt-4 text-center text-sm text-gray-700 bg-gray-100 rounded-lg py-2 px-3">
            {message}
          </div>
        )}

        {/* STARS */}
        <div className="flex justify-center mt-6 gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition transform hover:scale-110"
            >
              <Star
                size={32}
                className={
                  (hover || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>

        {/* COMMENT */}
        <textarea
          className="w-full mt-6 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Write your review..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={submitReview}
          disabled={loading}
          className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

      </div>
    </div>
  );
}