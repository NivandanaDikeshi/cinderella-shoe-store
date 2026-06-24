"use client";

import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuthStore } from "@/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}