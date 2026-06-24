"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";

interface Props {
  productId: string;
}

export default function ProductReviewsSection({ productId }: Props) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const reviewQuery = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );

      const reviewSnap = await getDocs(reviewQuery);

      const reviewData = reviewSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviews(reviewData);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      {/* REVIEW FORM */}
      <div className="lg:col-span-1">
        <ReviewForm productId={productId} reloadReviews={loadReviews} />
      </div>

      {/* REVIEW LIST */}
      <div className="lg:col-span-2">
        {loading ? (
          <div className="bg-white rounded-2xl border p-6 text-gray-500">
            Loading reviews...
          </div>
        ) : (
          <ReviewList reviews={reviews} />
        )}
      </div>
    </div>
  );
}