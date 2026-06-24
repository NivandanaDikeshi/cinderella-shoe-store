"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  ShoppingBag,
  Package,
  Contact,
  LogOut,
} from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { useAdminAuthStore } from "@/store/adminAuthStore";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roleCode, clearAdminData } = useAdminAuthStore();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Orders", href: "/admin/orders", icon: Package },
    { label: "Contacts", href: "/admin/contacts", icon: Contact },
    { label: "Roles", href: "/admin/roles", icon: ShieldCheck },
    { label: "Manage Staff", href: "/admin/manage-staff", icon: Users },
  ];

  const getRoleLabel = (code: number | null) => {
    switch (code) {
      case 0:
        return "Master Admin";
      case 1:
        return "Admin";
      case 2:
        return "Staff";
      default:
        return "Admin";
    }
  };

  const handleLogout = async () => {
    try {
      if (!auth) {
        console.error("Logout error: auth is not initialized");
        return;
      }
      await signOut(auth);
      clearAdminData();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="w-[280px] min-h-screen flex flex-col
      bg-gradient-to-b from-[#120A14] via-[#1A0F1F] to-[#0E0A10]
      text-white border-r border-pink-500/10 shadow-2xl">

      {/* ================= LOGO ================= */}
      <div className="px-6 py-8 border-b border-pink-500/10">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Cinderella
        </h1>

        <p className="text-xs text-pink-300/70 mt-1 tracking-[0.25em] uppercase">
          Admin Panel
        </p>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 px-4 py-6 space-y-1">

        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${
                  isActive
                    ? "text-pink-300 bg-white/5 border border-pink-500/20"
                    : "text-gray-300 hover:text-pink-300 hover:bg-white/5"
                }
              `}
            >

              {/* subtle glow */}
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-pink-500/5 transition" />

              <Icon
                size={18}
                className={`relative z-10 transition ${
                  isActive
                    ? "text-pink-300"
                    : "text-gray-400 group-hover:text-pink-300"
                }`}
              />

              <span className="relative z-10 font-medium text-sm">
                {item.label}
              </span>

            </Link>
          );
        })}

      </nav>

      {/* ================= USER SECTION ================= */}
      <div className="p-5 border-t border-pink-500/10 bg-white/5 backdrop-blur-md">

        <div className="mb-3">
          <p className="text-sm text-gray-200 truncate">
            {user?.email || "admin@cinderella.com"}
          </p>

          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full
            bg-pink-500/10 text-pink-300 border border-pink-500/20">
            {getRoleLabel(roleCode)}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5
            rounded-xl bg-pink-500 text-black font-semibold
            hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-500/20
            transition-all duration-200"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>

    </aside>
  );
}