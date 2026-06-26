"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // LOAD REVIEWS
  const fetchReviews = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data: Review[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Review, "id">),
      }));

      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // DELETE REVIEW
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // STARS UI
  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400 text-sm">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Customer Reviews
        </h1>
        <p className="text-gray-500 mt-1">
          Manage all product feedback from users
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500">No reviews found</div>
      ) : (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* TOP SECTION */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {review.userName || "Anonymous"}
                  </h2>

                  {/* USER ID BADGE */}
                  <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    User ID: {review.userId}
                  </span>
                </div>

                {/* STARS */}
                {renderStars(review.rating)}
              </div>

              {/* COMMENT */}
              <p className="mt-4 text-gray-700 leading-relaxed">
                {review.comment}
              </p>

              {/* ACTIONS */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => handleDelete(review.id)}
                  className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}