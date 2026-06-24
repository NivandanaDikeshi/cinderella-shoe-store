"use client";

import { useEffect, useState } from "react";

import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";

import {
  getReviewsByProductId,
} from "@/services/reviewService";

interface Props {
  productId: string;
}

export default function ProductReviews({
  productId,
}: Props) {
  const [reviews, setReviews] =
    useState<any[]>([]);

  const loadReviews = async () => {
    try {
      const data =
        await getReviewsByProductId(
          productId
        );

      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  return (
    <div className="mt-12">

      <h2 className="text-2xl font-bold mb-6">
        Customer Reviews
      </h2>

      <ReviewForm
        productId={productId}
        reloadReviews={loadReviews}
      />

      <ReviewList
        productId={productId}
      />

    </div>
  );
}