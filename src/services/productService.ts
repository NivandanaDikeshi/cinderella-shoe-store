import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

// GET ALL
export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

// GET BY ID (FIXED)
export const getProductById = async (id: string) => {
  if (!id) return null;

  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export default {
  getProducts,
  getProductById,
};