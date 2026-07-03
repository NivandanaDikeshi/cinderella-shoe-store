"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { setAdminData, clearAdminData, loading, setLoading } =
    useAdminAuthStore();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          await signOut(auth).catch(() => {});
          clearAdminData();
          setLoading(false);
          router.replace("/admin/login");
          return;
        }

        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await signOut(auth).catch(() => {});
          clearAdminData();
          setLoading(false);
          router.replace("/admin/login");
          return;
        }

        const userData = userSnap.data();
        const roleCode = Number(userData.roleCode);

        if (roleCode !== 0 && roleCode !== 1) {
          await signOut(auth).catch(() => {});
          clearAdminData();
          setLoading(false);
          router.replace("/admin/login");
          return;
        }

        setAdminData(firebaseUser, "admin", roleCode);
        setLoading(false);
      } catch (error) {
        console.error("Admin auth error:", error);
        clearAdminData();
        setLoading(false);
        router.replace("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [isLoginPage, router, setLoading, clearAdminData, setAdminData]);

  /* =========================
     LOGIN PAGE
  ========================= */
  if (isLoginPage) {
    return <>{children}</>;
  }

  /* =========================
     LOADING UI (MODERN MINIMAL)
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 mx-auto border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Loading Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN ADMIN LAYOUT
  ========================= */
  return (
    <div className="min-h-screen flex bg-[#f4f5f7] text-gray-900">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}