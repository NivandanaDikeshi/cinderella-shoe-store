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

    return snapshot.docs.map((productDoc) => ({
      id: productDoc.id,
      ...productDoc.data(),
    }));
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    return [];
  }
};

/**
 * Get Product By ID
 */
export const getProductById = async (id: string) => {
  try {
    if (!id) return null;

    const productRef = doc(db, "products", id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Error in getProductById:", error);
    return null;
  }
};

/**
 * Related Products
 */
export const getRelatedProducts = async (category: string) => {
  try {
    if (!category) return [];

    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      limit(8)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((productDoc) => ({
      id: productDoc.id,
      ...productDoc.data(),
    }));
  } catch (error) {
    console.error("Error in getRelatedProducts:", error);
    return [];
  }
};

/**
 * All Products
 */
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "products"));

    return snapshot.docs.map((productDoc) => ({
      id: productDoc.id,
      ...productDoc.data(),
    }));
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return [];
  }
};