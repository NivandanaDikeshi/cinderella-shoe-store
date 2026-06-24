import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

export const getCategories =
  async () => {
    const snapshot =
      await getDocs(
        collection(db, "categories")
      );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };