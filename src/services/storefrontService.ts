import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  limit,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

/**
 * Featured Products
 */
export const getFeaturedProducts = async () => {
  try {
    const q = query(
      collection(db, "products"),
      where("featured", "==", true)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("getFeaturedProducts:", error);
    return [];
  }
};

/**
 * Get Product By ID
 */
export const getProductById = async (id: string) => {
  try {
    const productRef = doc(db, "products", id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("getProductById:", error);
    return null;
  }
};

/**
 * Related Products
 */
export const getRelatedProducts = async (category: string) => {
  try {
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      limit(8)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("getRelatedProducts:", error);
    return [];
  }
};

/**
 * All Products
 */
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("getAllProducts:", error);
    return [];
  }
};