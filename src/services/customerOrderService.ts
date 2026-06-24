import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

export const getCustomerOrders =
  async (email: string) => {
    const q = query(
      collection(db, "orders"),
      where("email", "==", email)
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

export const getOrderDetails =
  async (id: string) => {
    const ref = doc(
      db,
      "orders",
      id
    );

    const snapshot =
      await getDoc(ref);

    if (!snapshot.exists())
      return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  };