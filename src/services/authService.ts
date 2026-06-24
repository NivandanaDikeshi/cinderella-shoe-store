import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase/config";

const register = async (
  name: string,
  email: string,
  password: string
) => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
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
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};

const googleLogin = async () => {
  const provider =
    new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  return await signInWithPopup(
    auth,
    provider
  );
};

const logout = async () => {
  await signOut(auth);
};

const authService = {
  register,
  login,
  googleLogin,
  logout,
};

export default authService;