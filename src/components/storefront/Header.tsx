"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import {
  Heart,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import * as authService from "@/services/authService";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Subtle shadow/border once the user scrolls, for depth
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setMobileOpen(false);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMenu = () => setMobileOpen(false);

  const badgeClasses =
    "absolute -right-1 -top-1 flex h-5 min-w-[18px] items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-semibold text-white shadow-sm ring-2 ring-white";

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "border-pink-100 shadow-md"
          : "border-pink-100/50 shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* LOGO */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-pink-100 transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
              <Image
                src="/logo.jpg"
                alt="Cinderella Logo"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                Cinderella
              </h1>
              <p className="text-xs uppercase tracking-widest text-pink-500">
                Shoe Store
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/my-orders"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname.startsWith("/my-orders")
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                My Orders
              </Link>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative rounded-full p-2 text-gray-700 transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className={badgeClasses}>{wishlistItems.length}</span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative rounded-full p-2 text-gray-700 transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className={badgeClasses}>{cartItems.length}</span>
              )}
            </Link>

            {/* Profile */}
            {user && (
              <Link
                href="/profile"
                aria-label="Profile"
                className="relative rounded-full p-2 text-gray-700 transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600"
              >
                <User size={20} />
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="rounded-full p-2 text-gray-700 transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600 lg:hidden"
            >
              <span className="relative block h-5 w-5">
                <Menu
                  size={20}
                  className={`absolute inset-0 transition-all duration-200 ${
                    mobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
                <X
                  size={20}
                  className={`absolute inset-0 transition-all duration-200 ${
                    mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                  }`}
                />
              </span>
            </button>

            {/* Auth (desktop) */}
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-full bg-black px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-800 lg:flex"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="hidden gap-3 lg:flex items-center ml-1">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-pink-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`grid overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="mt-1 rounded-2xl border border-pink-100 bg-white p-4 shadow-xl">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(link.href)
                        ? "bg-pink-50 text-pink-600"
                        : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <Link
                      href="/my-orders"
                      onClick={closeMenu}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        pathname.startsWith("/my-orders")
                          ? "bg-pink-50 text-pink-600"
                          : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                    >
                      My Orders
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-4 border-t border-pink-100 pt-3">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-800"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="rounded-xl border border-pink-100 p-2.5 text-center text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-pink-50"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="rounded-xl bg-pink-600 p-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-pink-700"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}