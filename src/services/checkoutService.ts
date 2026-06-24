import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const createOrder = async (order: any) => {
  const docRef = await addDoc(collection(db, "orders"), {
    ...order,
    status: order.status || "Pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};