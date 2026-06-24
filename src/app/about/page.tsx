"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: <Sparkles className="w-7 h-7 text-pink-600" />,
    title: "Quality",
    desc: "Every pair is crafted with premium materials and attention to detail for elegance, durability, and comfort.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-pink-600" />,
    title: "Style",
    desc: "We blend timeless beauty with modern trends to create collections that feel both luxurious and wearable.",
  },
  {
    icon: <HeartHandshake className="w-7 h-7 text-pink-600" />,
    title: "Comfort",
    desc: "Our footwear is designed to support confidence in every step, without compromising on all-day comfort.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900 overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">
        {/* background glow */}
        <div className="absolute -top-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] rounded-full bg-rose-200/30 blur-3xl" />

        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-700 shadow-sm">
                Our Brand Story
              </span>

              <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
                About
                <span className="block bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Cinderella Shoes
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                At Cinderella Shoes, we believe every woman deserves footwear
                that feels as beautiful as it looks — elegant, comfortable, and
                made to inspire confidence in every step.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Shop Collection
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-2xl border border-pink-200 bg-white px-8 py-4 text-gray-800 font-semibold hover:bg-pink-50 hover:border-pink-300 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-[500px]">
                <div className="absolute inset-0 bg-pink-200/30 blur-3xl rounded-full scale-110" />
                <div className="relative overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-2xl">
                  <Image
                    src="/images/about-hero.jpg"
                    alt="About Cinderella Shoes"
                    width={500}
                    height={550}
                    className="w-full h-[520px] object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-pink-100 blur-2xl opacity-70" />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-gray-100">
                <Image
                  src="/images/story.jpg"
                  alt="Our Story"
                  width={700}
                  height={500}
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </motion.div>

            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-[0.25em] text-pink-500 font-semibold">
                Our Story
              </p>

              <h2 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Designed for Elegance,
                <span className="block text-pink-600">
                  Crafted for Confidence
                </span>
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                Cinderella Shoe Store began with a simple vision — to bring
                together luxury, comfort, and affordability in one beautiful
                experience. We wanted to create footwear that doesn’t just follow
                fashion, but becomes part of a woman’s confidence, lifestyle,
                and identity.
              </p>

              <p className="mt-5 text-gray-600 leading-relaxed text-lg">
                Today, we continue that journey by offering thoughtfully curated
                collections for every occasion — from elegant heels to stylish
                everyday essentials — all designed to help you step out with
                grace and confidence.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-5">
                  <h3 className="text-2xl font-bold text-pink-600">2026</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    New premium collections for every season
                  </p>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-5">
                  <h3 className="text-2xl font-bold text-pink-600">100%</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Focused on style, comfort, and customer satisfaction
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-24 bg-gradient-to-b from-pink-50/60 to-white">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm uppercase tracking-[0.25em] text-pink-500 font-semibold">
              What We Stand For
            </p>

            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900">
              Our Core Values
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              Everything we do is guided by our commitment to exceptional
              quality, refined style, and effortless comfort.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
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

      {/* ================= CTA ================= */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 px-8 py-16 md:px-14 md:py-20 text-white text-center shadow-2xl">
            {/* decorative glow */}
            <div className="absolute -top-16 -left-10 w-52 h-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="uppercase tracking-[0.25em] text-sm font-semibold text-pink-100">
                Cinderella Collection
              </p>

              <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                Step Into Elegance Today
              </h2>

              <p className="mt-5 text-pink-50/90 text-lg leading-relaxed">
                Discover footwear that reflects your personality, complements
                your style, and makes every step feel extraordinary.
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-8 rounded-2xl bg-white px-8 py-4 font-semibold text-pink-600 shadow-lg hover:scale-[1.02] transition-all"
              >
                Shop Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}