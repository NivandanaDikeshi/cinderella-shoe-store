"use client";

import { useEffect, useState } from "react";

import { auth } from "@/lib/firebase/config";

import { getUserRole } from "@/services/roleService";

export default function usePermission() {
  const [role, setRole] =
    useState("");

  useEffect(() => {
    const user =
      auth.currentUser;

    if (user) {
      getUserRole(user.uid).then(
        (r) => setRole(r)
      );
    }
  }, []);

  return {
    role,
    isOwner:
      role === "owner",
    isStaff:
      role === "staff",
  };
}