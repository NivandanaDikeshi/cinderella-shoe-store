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
    <main className="bg-white text-gray-900 overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] rounded-full bg-rose-200/30 blur-3xl" />

        <div className="container mx-auto px-6 lg:px-10 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-700 shadow-sm">
                New Collection 2026
              </span>

              <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
                Step Into
                <span className="block bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Elegance & Comfort
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Discover premium shoes designed for confidence, comfort, and
                modern fashion — crafted to make every step unforgettable.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Shop Collection
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-2xl border border-pink-200 bg-white px-8 py-4 text-gray-800 font-semibold hover:bg-pink-50 hover:border-pink-300 transition-all"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pink-600" />
                  Secure shopping experience
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-pink-600" />
                  Fast delivery islandwide
                </div>
              </div>
            </motion.div>

            {/* RIGHT HERO SLIDER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:flex justify-center"
            >
              <HeroSlider />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm uppercase tracking-[0.25em] text-pink-500 font-semibold">
              Shop by Category
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900">
              Find the Perfect Style for Every Occasion
            </h2>
            <p className="mt-4 text-gray-600">
              From elegant heels to everyday slippers, explore our curated
              collections crafted for comfort and style.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
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
                  className="group block overflow-hidden rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70" />
                  </div>

                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Explore collection
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition">
                      <ArrowRight className="w-5 h-5 text-pink-600" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gradient-to-b from-pink-50/60 to-white">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm uppercase tracking-[0.25em] text-pink-500 font-semibold">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900">
              More Than Just Shoes
            </h2>
            <p className="mt-4 text-gray-600">
              We combine quality craftsmanship, elegant design, and dependable
              service to give you the best shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="bg-white border border-pink-100 rounded-[2rem] p-8 text-center shadow-sm hover:shadow-xl transition"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-5 shadow-sm">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 px-8 py-16 md:px-14 md:py-20 text-white text-center shadow-2xl">
            <div className="absolute -top-16 -left-10 w-52 h-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="uppercase tracking-[0.25em] text-sm font-semibold text-pink-100">
                Cinderella Collection
              </p>

              <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                Find Your Perfect Pair Today
              </h2>

              <p className="mt-5 text-pink-50/90 text-lg leading-relaxed">
                Discover elegant shoes that match your personality, elevate your
                confidence, and complete every outfit beautifully.
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-8 rounded-2xl bg-white px-8 py-4 font-semibold text-pink-600 shadow-lg hover:scale-[1.02] transition-all"
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