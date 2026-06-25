import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase/config";

const getAuthInstance = () => {
  if (!auth) {
    throw new Error("Firebase auth not initialized");
  }
  return auth;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const firebaseAuth = getAuthInstance();

  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  return userCredential;
};

export const login = async (email: string, password: string) => {
  const firebaseAuth = getAuthInstance();

  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

export const googleLogin = async () => {
  const firebaseAuth = getAuthInstance();

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  return signInWithPopup(firebaseAuth, provider);
};

export const logout = async () => {
  const firebaseAuth = getAuthInstance();
  await signOut(firebaseAuth);
};