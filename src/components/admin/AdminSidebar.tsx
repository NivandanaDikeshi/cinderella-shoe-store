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
  MessageSquare,
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
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
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
    await signOut(auth);
    clearAdminData();
    router.push("/admin/login");
  };

  return (
    <aside className="w-[280px] min-h-screen flex flex-col
      bg-white border-r border-pink-100 text-gray-800">

      {/* LOGO */}
      <div className="px-6 py-7 border-b border-pink-100 bg-pink-50">
        <h1 className="text-2xl font-bold text-pink-600">
          Cinderella
        </h1>
        <p className="text-xs text-pink-400 tracking-[0.3em] uppercase mt-1">
          Admin Panel
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition
              ${
                isActive
                  ? "bg-pink-50 text-pink-600"
                  : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              {/* ACTIVE BAR */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-pink-500 rounded-full" />
              )}

              <Icon size={18} />

              <span className="text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* USER */}
      <div className="p-5 border-t border-pink-100 bg-pink-50">
        <p className="text-sm text-gray-700 truncate">
          {user?.email || "admin@cinderella.com"}
        </p>

        <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full
          bg-pink-100 text-pink-600 border border-pink-200">
          {getRoleLabel(roleCode)}
        </span>

        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5
            rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}