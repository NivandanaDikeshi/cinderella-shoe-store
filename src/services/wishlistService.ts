import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

export const addToWishlist = async (
  userId: string,
  product: any
) => {
  await addDoc(
    collection(db, "wishlists"),
    {
      userId,
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      createdAt: new Date(),
    }
  );
};

export const getWishlist = async (
  userId: string
) => {
  const q = query(
    collection(db, "wishlists"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const removeWishlist = async (
  id: string
) => {
  await deleteDoc(
    doc(db, "wishlists", id)
  );
};