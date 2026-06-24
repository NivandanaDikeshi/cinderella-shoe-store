"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/hero1.jpg",
    title: "Elegant Heels",
    subtitle: "Luxury fashion for every special occasion",
  },
  {
    id: 2,
    image: "/images/hero2.jpg",
    title: "Stylish Sandals",
    subtitle: "Comfort and beauty in every step",
  },
  {
    id: 3,
    image: "/images/hero3.jpg",
    title: "Modern Flats",
    subtitle: "Everyday essentials with timeless elegance",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[560px]">
      {/* SLIDER CARD */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-pink-100">
        <div className="relative h-[500px] w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === current
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 translate-x-8 z-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

              {/* text */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold">{slide.title}</h3>
                <p className="mt-2 text-sm md:text-base text-white/90">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur hover:bg-white transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur hover:bg-white transition"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 text-gray-800" />
        </button>

        {/* dots */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all ${
                current === index
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}