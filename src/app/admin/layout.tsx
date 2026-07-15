"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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
        const roleCode = typeof userData.roleCode === "number" ? userData.roleCode : Number(userData.roleCode);

        // Customers (roleCode 99) are not allowed in the admin area
        if (roleCode === 99 || isNaN(roleCode)) {
          await signOut(auth).catch(() => {});
          clearAdminData();
          setLoading(false);
          router.replace("/admin/login");
          return;
        }

        // Fetch user permissions from the Roles collection matching their roleName
        let permissions: string[] = [];
        try {
          const rolesSnap = await getDocs(collection(db, "roles"));
          const matchedRole = rolesSnap.docs.find(
            (docSnap) => docSnap.data().name === userData.roleName
          );
          if (matchedRole) {
            permissions = matchedRole.data().permissions || [];
          } else if (roleCode === 0) {
            // Master Admin fallback if roles collection is empty/missing
            permissions = [
              "view dashboard",
              "manage orders",
              "manage products",
              "manage staff",
              "manage roles",
              "manage contacts",
              "manage reviews",
              "manage settings",
            ];
          }
        } catch (roleErr) {
          console.error("Error loading staff permissions:", roleErr);
          if (roleCode === 0) {
            permissions = [
              "view dashboard",
              "manage orders",
              "manage products",
              "manage staff",
              "manage roles",
              "manage contacts",
              "manage reviews",
              "manage settings",
            ];
          }
        }

        setAdminData(firebaseUser, "admin", roleCode, permissions);
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