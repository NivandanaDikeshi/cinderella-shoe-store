import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

// ADD REVIEW
export const addReview = async (data: any) => {
  return await addDoc(collection(db, "reviews"), data);
};

// GET REVIEWS BY PRODUCT
export const getReviewsByProductId = async (productId: string) => {
  const q = query(
    collection(db, "reviews"),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// UPDATE REVIEW
export const updateReview = async (id: string, data: any) => {
  await updateDoc(doc(db, "reviews", id), data);
};

// DELETE REVIEW
export const deleteReview = async (id: string) => {
  await deleteDoc(doc(db, "reviews", id));
};