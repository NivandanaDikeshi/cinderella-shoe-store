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
  LogOut,
  MessageSquare,
} from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { useAdminAuthStore } from "@/store/adminAuthStore";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roleCode, hasPermission, clearAdminData } = useAdminAuthStore();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, permission: "view dashboard" },
    { label: "Products", href: "/admin/products", icon: ShoppingBag, permission: "manage products" },
    { label: "Orders", href: "/admin/orders", icon: Package, permission: "manage orders" },
    { label: "Contacts", href: "/admin/contacts", icon: MessageSquare, permission: "manage contacts" },
    { label: "Reviews", href: "/admin/reviews", icon: ShieldCheck, permission: "manage reviews" },
    { label: "Roles", href: "/admin/roles", icon: ShieldCheck, permission: "manage roles" },
    { label: "Manage Staff", href: "/admin/manage-staff", icon: Users, permission: "manage staff" },
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
    await signOut(auth);
    clearAdminData();
    router.push("/admin/login");
  };

  return (
    <aside className="w-[280px] min-h-screen flex flex-col bg-white border-r border-gray-200 text-gray-800">

      {/* LOGO */}
      <div className="px-6 py-7 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Cinderella
        </h1>
        <p className="text-xs text-gray-500 tracking-[0.3em] uppercase mt-1">
          Admin Panel
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems
          .filter((item) => roleCode === 0 || (typeof hasPermission === "function" && hasPermission(item.permission)))
          .map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition
              ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-black rounded-full" />
              )}

              <Icon size={18} />

              <span className="text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* USER SECTION */}
      <div className="p-5 border-t border-gray-200 bg-gray-50">

        <p className="text-sm text-gray-700 truncate">
          {user?.email || "admin@cinderella.com"}
        </p>

        <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-gray-200 text-gray-700">
          {getRoleLabel(roleCode)}
        </span>

        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}