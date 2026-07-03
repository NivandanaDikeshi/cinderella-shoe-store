import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

// SAFE GET ALL PRODUCTS
export const getProducts = async () => {
  try {
    if (!db) return [];

    const snapshot = await getDocs(collection(db, "products"));

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
};

// SAFE GET PRODUCT BY ID
export const getProductById = async (id: string) => {
  try {
    if (!id || !db) return null;

    const docRef = doc(db, "products", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("getProductById error:", error);
    return null;
  }
};

export default {
  getProducts,
  getProductById,
};