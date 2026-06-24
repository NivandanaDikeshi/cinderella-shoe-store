import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

const COLLECTION = "banners";

const getBanners = async () => {
  const q = query(
    collection(db, COLLECTION),
    orderBy("displayOrder", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const createBanner = async (
  banner: any
) => {
  return await addDoc(
    collection(db, COLLECTION),
    {
      ...banner,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
};

const updateBanner = async (
  id: string,
  banner: any
) => {
  return await updateDoc(
    doc(db, COLLECTION, id),
    {
      ...banner,
      updatedAt: new Date(),
    }
  );
};

const deleteBanner = async (
  id: string
) => {
  return await deleteDoc(
    doc(db, COLLECTION, id)
  );
};

export default {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};