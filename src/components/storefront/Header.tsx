"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Package,
  Home,
  Store,
  Phone,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import authService from "@/services/authService";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: Store },
    { href: "/about", label: "About", icon: User },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100/70 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* ================= LOGO ================= */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
              <Image
                src="/logo.jpg"
                alt="Cinderella Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="leading-tight">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                Cinderella
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-500 font-semibold">
                Shoe Store
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-pink-50 text-pink-600 shadow-sm"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <>
                <Link
                  href="/my-orders"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    pathname === "/my-orders"
                      ? "bg-pink-50 text-pink-600 shadow-sm"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <Package size={16} />
                  My Orders
                </Link>

                <Link
                  href="/profile"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                    pathname === "/profile"
                      ? "bg-pink-50 text-pink-600 shadow-sm"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <User size={16} />
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* ================= RIGHT ACTIONS ================= */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-600 px-1 text-[11px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600"
              aria-label="Cart"
            >
              <ShoppingBag size={19} />
              {cartItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-600 px-1 text-[11px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth area */}
            {user ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="hidden xl:flex items-center gap-3 rounded-full border border-pink-100 bg-white px-3 py-2 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold">
                    {user.displayName?.charAt(0)?.toUpperCase() ||
                      user.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>

                  <div className="max-w-[180px]">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.displayName || "Customer"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  href="/login"
                  className="rounded-full border border-pink-200 px-5 py-2.5 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ================= MOBILE BUTTONS ================= */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 bg-white"
            >
              <Heart size={18} />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-600 px-1 text-[11px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 bg-white"
            >
              <ShoppingBag size={18} />
              {cartItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-600 px-1 text-[11px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-100 bg-white shadow-sm"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileOpen && (
          <div className="lg:hidden pb-5">
            <div className="mt-2 rounded-3xl border border-pink-100 bg-white p-4 shadow-xl">
              {/* user info */}
              {user ? (
                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-pink-50 p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold">
                    {user.displayName?.charAt(0)?.toUpperCase() ||
                      user.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.displayName || "Customer"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-pink-50 text-pink-600"
                          : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                    >
                      <Icon size={18} />
                      {link.label}
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <Link
                      href="/my-orders"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        pathname === "/my-orders"
                          ? "bg-pink-50 text-pink-600"
                          : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                    >
                      <Package size={18} />
                      My Orders
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        pathname === "/profile"
                          ? "bg-pink-50 text-pink-600"
                          : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                    >
                      <User size={18} />
                      Profile
                    </Link>
                  </>
                )}
              </div>

              {/* auth buttons */}
              <div className="mt-4 border-t border-pink-100 pt-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl border border-pink-200 px-4 py-3 text-center text-sm font-semibold text-pink-600 hover:bg-pink-50"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}