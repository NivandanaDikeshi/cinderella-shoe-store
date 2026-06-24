import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

export const getUserRole =
  async (
    uid: string
  ) => {
    const docRef = doc(
      db,
      "users",
      uid
    );

    const snapshot =
      await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data().role;
  };