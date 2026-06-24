"use client";

import { useRouter } from "next/navigation";

import authService from "@/services/authService";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();

      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
}