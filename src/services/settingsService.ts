import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

const SETTINGS_ID = "storeConfig";

const getSettings = async () => {
  const docRef = doc(
    db,
    "settings",
    SETTINGS_ID
  );

  const snapshot =
    await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
};

const saveSettings = async (
  data: any
) => {
  const docRef = doc(
    db,
    "settings",
    SETTINGS_ID
  );

  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: new Date(),
    },
    { merge: true }
  );
};

export default {
  getSettings,
  saveSettings,
};