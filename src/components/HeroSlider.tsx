"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const AUTOPLAY_MS = 5500;

export default function HeroSlider() {
  const heroSlides = useMemo(
    () => [
      {
        image: "/images/hero1.jpg",
        tag: "Step Into Elegance",
        titleLine1: "Find Your Perfect",
        titleLine2: "Pair",
        title: "Find Your Perfect Pair",
        desc: "Discover stylish footwear designed to bring confidence, comfort, and elegance to every step you take.",
        link: "/shop?category=Heels",
      },
      {
        image: "/images/hero2.jpg",
        tag: "New Season Collection",
        titleLine1: "Style That Speaks",
        titleLine2: "for You",
        title: "Style That Speaks for You",
        desc: "Explore beautiful designs crafted for every occasion, from everyday wear to your most special moments.",
        link: "/shop?category=Heels",
      },
      {
        image: "/images/hero3.jpg",
        tag: "Fashion Meets Comfort",
        titleLine1: "Walk with",
        titleLine2: "Confidence",
        title: "Walk with Confidence",
        desc: "Experience the perfect blend of modern fashion, premium quality, and all-day comfort in every pair.",
        link: "/shop?category=Heels",
      },
    ],
    []
  );

  const reduceMotion = Boolean(useReducedMotion());

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState<1 | -1>(1);
  const [heroPaused, setHeroPaused] = useState(false);
  const [heroProgressKey, setHeroProgressKey] = useState(0);
  const heroTouchStartX = useRef<number | null>(null);

  const goToHero = useCallback((index: number, dir: 1 | -1) => {
    setHeroDirection(dir);
    setHeroIndex(index);
    setHeroProgressKey((k) => k + 1);
  }, []);

  const handleNextHero = useCallback(() => {
    goToHero((heroIndex + 1) % heroSlides.length, 1);
  }, [heroIndex, heroSlides.length, goToHero]);

  const handlePrevHero = useCallback(() => {
    goToHero((heroIndex - 1 + heroSlides.length) % heroSlides.length, -1);
  }, [heroIndex, heroSlides.length, goToHero]);

  // Autoplay — pauses on hover/focus and respects reduced-motion users
  useEffect(() => {
    if (reduceMotion || heroPaused) return;
    const timer = setInterval(handleNextHero, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [reduceMotion, heroPaused, handleNextHero]);

  // Keyboard navigation for the hero slider
  const handleHeroKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNextHero();
    if (e.key === "ArrowLeft") handlePrevHero();
  };

  // Touch swipe support for the hero slider
  const handleHeroTouchStart = (e: React.TouchEvent) => {
    heroTouchStartX.current = e.touches[0].clientX;
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (heroTouchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - heroTouchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        handlePrevHero();
      } else {
        handleNextHero();
      }
    }
    heroTouchStartX.current = null;
  };

  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50 lg:min-h-[95vh]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      tabIndex={0}
      onKeyDown={handleHeroKeyDown}
      onMouseEnter={() => setHeroPaused(true)}
      onMouseLeave={() => setHeroPaused(false)}
      onFocus={() => setHeroPaused(true)}
      onBlur={() => setHeroPaused(false)}
      onTouchStart={handleHeroTouchStart}
      onTouchEnd={handleHeroTouchEnd}
    >
      <div className="absolute -top-24 -left-24 w-[22rem] sm:w-[32rem] h-[22rem] sm:h-[32rem] rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[22rem] sm:w-[30rem] h-[22rem] sm:h-[30rem] rounded-full bg-rose-200/30 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* HERO LEFT - TEXT CONTENT */}
          <div className="relative z-10 lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-pink-700 shadow-sm">
              <Sparkles size={12} className="motion-safe:animate-pulse" />
              Sri Lanka's Premium Footwear Boutique
            </span>

            <div className="mt-5 relative h-[190px] sm:h-[210px] md:h-[230px] lg:h-[250px] overflow-hidden">
              <AnimatePresence mode="wait" custom={heroDirection}>
                <motion.div
                  key={heroIndex}
                  custom={heroDirection}
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 20,
                    x: reduceMotion ? 0 : heroDirection * 24,
                  }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{
                    opacity: 0,
                    y: reduceMotion ? 0 : -20,
                    x: reduceMotion ? 0 : heroDirection * -24,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
                    {heroSlides[heroIndex].tag}
                  </p>
                  <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
                    {heroSlides[heroIndex].titleLine1}
                    <span className="block bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                      {heroSlides[heroIndex].titleLine2}
                    </span>
                  </h1>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
                    {heroSlides[heroIndex].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-7 sm:px-8 py-3.5 sm:py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                Shop New Arrivals
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-pink-200 bg-white px-7 sm:px-8 py-3.5 sm:py-4 text-gray-800 font-semibold hover:bg-pink-50 transition-all text-sm sm:text-base"
              >
                Our Story
              </Link>
            </div>

            {/* Slider Controls */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevHero}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white text-gray-900 transition duration-200 hover:border-pink-400 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextHero}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-white text-gray-900 transition duration-200 hover:border-pink-400 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex gap-1.5" role="tablist" aria-label="Hero slides">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToHero(idx, idx > heroIndex ? 1 : -1)}
                    role="tab"
                    aria-selected={heroIndex === idx}
                    aria-label={`Show ${slide.title}`}
                    className={`relative h-2 overflow-hidden rounded-full bg-pink-100 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
                      heroIndex === idx ? "w-6" : "w-2 hover:bg-pink-200"
                    }`}
                  >
                    {heroIndex === idx && !heroPaused && !reduceMotion && (
                      <motion.span
                        key={heroProgressKey}
                        className="absolute inset-0 rounded-full bg-pink-600"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                    {heroIndex === idx && (heroPaused || reduceMotion) && (
                      <span className="absolute inset-0 rounded-full bg-pink-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* HERO RIGHT - ANIMATED GALLERY IMAGE */}
          <div className="relative flex justify-center lg:col-span-6">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px]">
              <div className="absolute inset-0 bg-pink-200/30 blur-3xl rounded-full scale-110" />

              <div className="relative h-[440px] sm:h-[520px] lg:h-[580px] overflow-hidden rounded-[2rem] border border-pink-100 bg-white p-3 shadow-2xl">
                <div className="absolute inset-4 rounded-[1.5rem] border border-pink-200/40 pointer-events-none z-20" />

                <AnimatePresence mode="wait" custom={heroDirection}>
                  <motion.div
                    key={heroIndex}
                    custom={heroDirection}
                    initial={{
                      opacity: 0,
                      scale: reduceMotion ? 1 : 1.05,
                      x: reduceMotion ? 0 : heroDirection * 16,
                    }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      scale: reduceMotion ? 1 : 0.98,
                      x: reduceMotion ? 0 : heroDirection * -16,
                    }}
                    transition={{ duration: 0.8 }}
                    className="relative h-full w-full overflow-hidden rounded-[1.5rem]"
                  >
                    <img
                      src={heroSlides[heroIndex].image}
                      alt={heroSlides[heroIndex].title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white z-10">
                      <div>
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-pink-50">
                          Comfort First
                        </span>
                        <h4 className="text-base font-bold">{heroSlides[heroIndex].title}</h4>
                      </div>
                      <Link
                        href={heroSlides[heroIndex].link}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition hover:bg-white hover:text-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        aria-label={`Shop ${heroSlides[heroIndex].title}`}
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}