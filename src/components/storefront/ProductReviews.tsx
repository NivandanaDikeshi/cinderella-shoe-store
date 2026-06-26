"use client";

import { useEffect, useState } from "react";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import { getReviewsByProductId } from "@/services/reviewService";

interface Props {
  productId: string;
}

export default function ProductReviews({
  productId,
}: Props) {
  const [reviews, setReviews] = useState<any[]>([]);

  const loadReviews = async () => {
    try {
      const data = await getReviewsByProductId(productId);
      setReviews(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Customer Reviews
        </h2>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Share your experience and see what other customers think.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <ReviewForm
          productId={productId}
          reloadReviews={loadReviews}
        />

        <div className="mt-8">
          <ReviewList productId={productId} />
        </div>
      </div>
    </section>
  );
}