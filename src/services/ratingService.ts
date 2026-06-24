import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

export const getProductRating =
  async (productId: string) => {
    const q = query(
      collection(db, "reviews"),
      where(
        "productId",
        "==",
        productId
      )
    );

    const snapshot =
      await getDocs(q);

    const reviews =
      snapshot.docs.map(
        (doc) => doc.data()
      );

    if (reviews.length === 0) {
      return {
        average: 0,
        count: 0,
      };
    }

    const total =
      reviews.reduce(
        (sum: number, review: any) =>
          sum + review.rating,
        0
      );

    return {
      average:
        total /
        reviews.length,
      count:
        reviews.length,
    };
  };