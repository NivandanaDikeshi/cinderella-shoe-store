"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Heart,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-pink-100 bg-white text-gray-900">
      {/* ================= TOP CTA STRIP ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500">
        <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-100">
              Cinderella Shoe Store
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Step into elegance with every collection
            </h2>
            <p className="mt-3 text-pink-50/90 text-base md:text-lg">
              Discover stylish, comfortable, and premium footwear crafted to
              elevate every moment.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-pink-600 shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            Shop Collection
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="relative">
        {/* soft background glow */}
        <div className="absolute -top-10 left-0 h-56 w-56 rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* ================= BRAND ================= */}
            <div className="lg:col-span-4">
              <div className="max-w-md">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Cinderella
                </h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
                  Shoe Store
                </p>

                <p className="mt-5 text-gray-600 leading-relaxed">
                  Cinderella Shoe Store brings together elegance, comfort, and
                  modern style in one beautiful destination. From everyday
                  essentials to statement pieces, we create footwear designed to
                  inspire confidence in every step.
                </p>

                {/* Social Icons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/share/1BCDAqM8HV/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600 hover:shadow-md"
                    aria-label="Facebook"
                  >
                    <FaFacebookF size={16} />
                  </a>

                  <a
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600 hover:shadow-md"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={17} />
                  </a>

                  <a
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600 hover:shadow-md"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={16} />
                  </a>

                  <a
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600 hover:shadow-md"
                    aria-label="YouTube"
                  >
                    <FaYoutube size={17} />
                  </a>
                </div>
              </div>
            </div>

            {/* ================= QUICK LINKS ================= */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
              <ul className="mt-5 space-y-3 text-gray-600">
                <li>
                  <Link href="/" className="transition hover:text-pink-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="transition hover:text-pink-600">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition hover:text-pink-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:text-pink-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* ================= CUSTOMER AREA ================= */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900">Customer</h3>
              <ul className="mt-5 space-y-3 text-gray-600">
                <li>
                  <Link
                    href="/wishlist"
                    className="transition hover:text-pink-600"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="transition hover:text-pink-600">
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-orders"
                    className="transition hover:text-pink-600"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="transition hover:text-pink-600"
                  >
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* ================= CONTACT + NEWSLETTER ================= */}
            <div className="lg:col-span-4">
              <h3 className="text-lg font-bold text-gray-900">
                Contact & Updates
              </h3>

              <div className="mt-5 space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-pink-600" />
                  <span>support@cinderellastore.com</span>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-pink-600" />
                  <span>+94 77 123 4567</span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-pink-600" />
                  <span>Negombo, Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM BAR ================= */}
          <div className="mt-14 border-t border-pink-100 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
              <p>
                © {year} Cinderella Shoe Store. All rights reserved.
              </p>

              <div className="flex flex-wrap items-center gap-5">
                <Link href="/privacy" className="hover:text-pink-600 transition">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-pink-600 transition">
                  Terms & Conditions
                </Link>
                <p className="flex items-center gap-1 text-gray-500">
                  Made with <Heart className="h-4 w-4 fill-pink-500 text-pink-500" /> for elegant shopping
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}