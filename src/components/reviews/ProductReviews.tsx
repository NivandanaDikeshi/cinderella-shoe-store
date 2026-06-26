"use client";

import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { getReviewsByProductId } from "@/services/reviewService";

export default function ProductReviews({
  productId,
}: {
  productId: string;
}) {
  const [reviews, setReviews] = useState<any[]>([]);

  const loadReviews = async () => {
    const data = await getReviewsByProductId(productId);
    setReviews(data || []);
  };

  useEffect(() => {
    if (productId) loadReviews();
  }, [productId]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Customer Reviews
      </h2>

      <ReviewForm
        productId={productId}
        reloadReviews={loadReviews}
      />

      <ReviewList reviews={reviews} />
    </div>
  );
}