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

// Get All Products
const getProducts = async () => {
  const snapshot = await getDocs(
    collection(db, "products")
  );

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
};

// Get Product By ID
const getProductById = async (
  id: string
) => {
  const docRef = doc(db, "products", id);

  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

// Create Product
const createProduct = async (
  product: any
) => {
  return await addDoc(
    collection(db, "products"),
    {
      ...product,
      createdAt: new Date(),
    }
  );
};

// Update Product
const updateProduct = async (
  id: string,
  data: any
) => {
  const docRef = doc(db, "products", id);

  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
};

// Delete Product
const deleteProduct = async (
  id: string
) => {
  await deleteDoc(
    doc(db, "products", id)
  );
};

const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;