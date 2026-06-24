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

      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-1">
        <ReviewForm productId={productId} reloadReviews={loadReviews} />
      </div>

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