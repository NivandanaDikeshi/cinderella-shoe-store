import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase/config";

const getSafeAuth = () => {
  if (!auth) {
    throw new Error("Firebase auth is not available.");
  }
  return auth;
};

const register = async (
  name: string,
  email: string,
  password: string
) => {
  const firebaseAuth = getSafeAuth();

  const userCredential =
    await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

  await updateProfile(
    userCredential.user,
    {
      displayName: name,
    }
  );

  return userCredential;
};

const login = async (
  email: string,
  password: string
) => {
  const firebaseAuth = getSafeAuth();

  return await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );
};

const googleLogin = async () => {
  const firebaseAuth = getSafeAuth();

  const provider =
    new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  return await signInWithPopup(
    firebaseAuth,
    provider
  );
};

const logout = async () => {
  const firebaseAuth = getSafeAuth();
  await signOut(firebaseAuth);
};

const authService = {
  register,
  login,
  googleLogin,
  logout,
};

export default authService;