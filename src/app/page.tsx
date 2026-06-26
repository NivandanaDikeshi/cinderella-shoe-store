"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
 Truck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";

const categories = [
  { name: "Heels", img: "/images/heels.jpg" },
  { name: "Sandals", img: "/images/sandals.jpg" },
  { name: "Flats", img: "/images/flats.jpg" },
  { name: "Slippers", img: "/images/slippers.jpg" },
];

const features = [
  {
    icon: <Star className="w-8 h-8 text-pink-600" />,
    title: "Premium Quality",
    desc: "Crafted with high-quality materials for long-lasting comfort and elegance.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-pink-600" />,
    title: "Trendy Designs",
    desc: "Discover fashion-forward collections inspired by modern style and timeless beauty.",
  },
  {
    icon: <Truck className="w-8 h-8 text-pink-600" />,
    title: "Fast Delivery",
    desc: "Quick and reliable delivery across Sri Lanka, right to your doorstep.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-gray-900">
      {/* HERO */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50 md:min-h-screen">
        {/* Background glow */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl md:h-[28rem] md:w-[28rem]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl md:h-[26rem] md:w-[26rem]" />

        <div className="container relative z-10 mx-auto px-4 py-14 sm:px-6 md:py-20 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1.5 text-xs font-semibold text-pink-700 shadow-sm sm:px-4 sm:text-sm">
                New Collection 2026
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-7xl">
                Step Into
                <span className="block bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Elegance & Comfort
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                Discover premium shoes designed for confidence, comfort, and
                modern fashion. Crafted to make every step memorable.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/shop"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                >
                  Shop Collection
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-pink-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition-all hover:border-pink-300 hover:bg-pink-50 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-pink-600" />
                  Secure shopping experience
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-pink-600" />
                  Fast delivery islandwide
                </div>
              </div>
            </motion.div>

            {/* RIGHT HERO SLIDER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[600px]">
                <HeroSlider />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500 sm:text-sm">
              Shop by Category
            </p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
              Find the Perfect Style for Every Occasion
            </h2>
            <p className="mt-4 text-sm text-gray-600 sm:text-base">
              From elegant heels to everyday slippers, explore our curated
              collections crafted for comfort and style.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 sm:gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group block overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="relative h-64 overflow-hidden sm:h-72 lg:h-80">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70" />
                  </div>

                  <div className="flex items-center justify-between p-5 sm:p-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-pink-600 sm:text-2xl">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Explore collection
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 transition group-hover:bg-pink-100 sm:h-11 sm:w-11">
                      <ArrowRight className="h-5 w-5 text-pink-600" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gradient-to-b from-pink-50/60 to-white py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500 sm:text-sm">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
              More Than Just Shoes
            </h2>
            <p className="mt-4 text-sm text-gray-600 sm:text-base">
              We combine quality craftsmanship, elegant design, and dependable
              service to give you the best shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-[2rem] border border-pink-100 bg-white p-6 text-center shadow-sm transition hover:shadow-xl sm:p-8"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 shadow-sm sm:h-16 sm:w-16">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 px-5 py-12 text-center text-white shadow-2xl sm:px-8 sm:py-16 md:rounded-[2.5rem] md:px-14 md:py-20">
            <div className="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-52 sm:w-52" />
            <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl sm:h-72 sm:w-72" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-100 sm:text-sm">
                Cinderella Collection
              </p>

              <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
                Find Your Perfect Pair Today
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-pink-50/90 sm:text-base md:text-lg">
                Discover elegant shoes that match your personality, elevate your
                confidence, and complete every outfit beautifully.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-pink-600 shadow-lg transition-all hover:scale-[1.02] sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                Start Shopping
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}