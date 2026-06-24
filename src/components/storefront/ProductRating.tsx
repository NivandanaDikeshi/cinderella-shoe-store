"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getProductRating,
} from "@/services/ratingService";

interface Props {
  productId: string;
}

export default function ProductRating({
  productId,
}: Props) {
  const [rating, setRating] =
    useState({
      average: 0,
      count: 0,
    });

  useEffect(() => {
    loadRating();
  }, []);

  const loadRating =
    async () => {
      const data =
        await getProductRating(
          productId
        );

      setRating(data);
    };

  return (
    <div className="flex items-center gap-2 mt-2">

      <span className="text-yellow-500">
        ⭐
      </span>

      <span className="font-medium">
        {rating.average.toFixed(
          1
        )}
      </span>

      <span className="text-gray-500">
        (
        {rating.count}
        {" "}
        Reviews)
      </span>

    </div>
  );
}