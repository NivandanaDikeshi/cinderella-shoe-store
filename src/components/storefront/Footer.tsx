"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Mail, Phone, MapPin, ArrowRight, Heart, Star } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-pink-100 bg-white text-gray-900">
      
      {/* TOP CTA STRIP */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500">
        <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 text-center sm:px-6 md:py-10 lg:flex-row lg:px-8 lg:text-left">
          
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-100 sm:text-sm">
              Cinderella Shoe Store
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
              Step into elegance with every collection
            </h2>
            <p className="mt-3 text-sm text-pink-50/90 sm:text-base md:text-lg">
              Discover stylish, comfortable, and premium footwear crafted to
              elevate every moment.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-pink-600 shadow-lg transition hover:scale-[1.02] hover:shadow-xl sm:w-auto"
          >
            Shop Collection
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="relative">
        <div className="absolute -top-10 left-0 h-56 w-56 rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          
          <div className="grid gap-10 text-center lg:grid-cols-12 lg:gap-12 lg:text-left">

            {/* BRAND */}
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Cinderella
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-pink-500 sm:text-sm">
                Shoe Store
              </p>

              <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                Cinderella Shoe Store brings together elegance, comfort, and modern style.
              </p>

              {/* SOCIAL */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                
                <a
                  href="https://www.facebook.com/share/1BCDAqM8HV/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:text-pink-600"
                >
                  <FaFacebookF />
                </a>

                <a className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700">
                  <FaInstagram />
                </a>

                <a className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700">
                  <FaTwitter />
                </a>

                <a className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-700">
                  <FaYoutube />
                </a>

              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="mt-5 space-y-3 text-gray-600">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/shop">Shop</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* CUSTOMER */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold">Customer</h3>
              <ul className="mt-5 space-y-3 text-gray-600">

                <li>
                  <Link href="/wishlist">Wishlist</Link>
                </li>

                <li>
                  <Link href="/cart">Cart</Link>
                </li>

                <li>
                  <Link href="/my-orders">Orders</Link>
                </li>

                <li>
                  <Link href="/profile">Profile</Link>
                </li>

                {/* ⭐ RATE US ADDED HERE */}
                <li className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" />
                  <Link href="/review" className="text-pink-600 font-medium hover:underline">
                    Rate Us
                  </Link>
                </li>

              </ul>
            </div>

            {/* CONTACT */}
            <div className="lg:col-span-4">
              <h3 className="text-lg font-bold">Contact</h3>

              <div className="mt-5 space-y-4 text-gray-600">
                <div className="flex gap-3">
                  <Mail className="text-pink-600" />
                  support@cinderellastore.com
                </div>

                <div className="flex gap-3">
                  <Phone className="text-pink-600" />
                  +94 77 123 4567
                </div>

                <div className="flex gap-3">
                  <MapPin className="text-pink-600" />
                  Negombo, Sri Lanka
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="mt-12 border-t border-pink-100 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">

              <p>© {year} Cinderella Shoe Store. All rights reserved.</p>

              <div className="flex flex-wrap items-center gap-5">
                
                <Link href="/privacy-policy" className="hover:text-pink-600">
                  Privacy Policy
                </Link>

                <Link href="/terms-and-conditions" className="hover:text-pink-600">
                  Terms & Conditions
                </Link>

                <p className="flex items-center gap-1">
                  Made with <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                </p>

              </div>

            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}