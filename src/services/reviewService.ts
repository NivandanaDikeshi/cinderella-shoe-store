import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ➕ ADD REVIEW
export const addReview = async (data: any) => {
  return await addDoc(collection(db, "reviews"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// 📥 GET REVIEWS FOR PRODUCT
export const getReviewsByProductId = async (productId: string) => {
  const q = query(
    collection(db, "reviews"),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};