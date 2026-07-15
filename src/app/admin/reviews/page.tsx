"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import AccessDenied from "@/components/admin/AccessDenied";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { Star, Trash2, User } from "lucide-react";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

export default function AdminReviewsPage() {
  const { roleCode, hasPermission, loading: authLoading } = useAdminAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;

    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const canManage = roleCode === 0 || (typeof hasPermission === "function" && hasPermission("manage reviews"));
  if (!canManage) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Customer Reviews
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and moderate product feedback
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-500 animate-pulse">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
          No reviews found
        </div>
      ) : (
        <div className="grid gap-6">

          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >

              {/* TOP */}
              <div className="flex justify-between items-start">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={18} className="text-gray-600" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {review.userName || "Anonymous"}
                    </h2>

                    <p className="text-xs text-gray-400">
                      User ID: {review.userId}
                    </p>
                  </div>

                </div>

                {/* RATING BADGE */}
                <div className="flex flex-col items-end gap-1">
                  {renderStars(review.rating)}

                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 font-medium">
                    {review.rating}/5
                  </span>
                </div>

              </div>

              {/* COMMENT */}
              <p className="mt-4 text-gray-700 leading-relaxed">
                {review.comment}
              </p>

              {/* ACTIONS */}
              <div className="mt-5 flex justify-end">

                <button
                  onClick={() => handleDelete(review.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm"
                >
                  <Trash2 size={14} />
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}