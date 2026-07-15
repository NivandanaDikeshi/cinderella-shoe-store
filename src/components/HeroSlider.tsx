"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/images/hero1.jpg",
    tag: "New Collection",
    title: "Elegant Heels",
    subtitle:
      "Luxury footwear designed to make every special moment unforgettable.",
  },
  {
    id: 2,
    image: "/images/hero2.jpg",
    tag: "Premium Comfort",
    title: "Stylish Sandals",
    subtitle:
      "Beautiful designs crafted with comfort and confidence in every step.",
  },
  {
    id: 3,
    image: "/images/hero3.jpg",
    tag: "Everyday Elegance",
    title: "Modern Flats",
    subtitle:
      "Timeless essentials that complete your everyday fashion look.",
  },
];


export default function HeroSlider() {

  const [current,setCurrent] = useState(0);


  const nextSlide = () => {
    setCurrent((prev)=>
      (prev + 1) % slides.length
    );
  };


  const prevSlide = () => {
    setCurrent((prev)=>
      (prev - 1 + slides.length) % slides.length
    );
  };


  useEffect(()=>{

    const timer=setInterval(()=>{
      nextSlide();
    },5000);


    return ()=>clearInterval(timer);

  },[]);



  return (

    <div className="relative w-full max-w-[560px]">

      <div
        className="
        relative
        overflow-hidden
        rounded-[2.5rem]
        border
        border-border
        bg-white
        shadow-[0_25px_60px_rgba(235,19,125,0.15)]
        "
      >


        {/* IMAGE AREA */}

        <div className="
          relative
          h-[420px]
          sm:h-[520px]
          "
        >

        <AnimatePresence mode="wait">


        <motion.div

          key={slides[current].id}

          initial={{
            opacity:0,
            scale:1.05
          }}

          animate={{
            opacity:1,
            scale:1
          }}

          exit={{
            opacity:0,
            scale:0.98
          }}

          transition={{
            duration:0.7
          }}

          className="
          absolute
          inset-0
          "

        >


          <Image

            src={slides[current].image}

            alt={slides[current].title}

            fill

            priority

            className="
            object-cover
            "

          />


          {/* Luxury Overlay */}

          <div
          className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/70
          via-black/20
          to-transparent
          "
          />



          {/* CONTENT */}

          <div
          className="
          absolute
          bottom-0
          left-0
          right-0
          p-6
          sm:p-8
          text-white
          "
          >


          <div
          className="
          flex
          items-center
          gap-2
          text-xs
          uppercase
          tracking-[0.25em]
          text-pink-100
          "
          >

          <Sparkles size={14}/>

          {slides[current].tag}

          </div>



          <h2
          className="
          mt-3
          text-3xl
          sm:text-4xl
          font-bold
          "
          >

          {slides[current].title}

          </h2>



          <p
          className="
          mt-3
          max-w-md
          text-sm
          sm:text-base
          text-white/90
          "
          >

          {slides[current].subtitle}

          </p>



          <Link

          href="/shop"

          className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-brand-primary
          px-6
          py-3
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-brand-hover
          "

          >

          Shop Now

          <ArrowRight size={16}/>

          </Link>


          </div>


        </motion.div>


        </AnimatePresence>


        </div>




        {/* ARROWS */}


        <button

        onClick={prevSlide}

        className="
        absolute
        left-4
        top-1/2
        z-20
        -translate-y-1/2
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-white/90
        shadow-lg
        transition
        hover:bg-brand-primary
        hover:text-white
        "

        >

        <ChevronLeft size={20}/>

        </button>



        <button

        onClick={nextSlide}

        className="
        absolute
        right-4
        top-1/2
        z-20
        -translate-y-1/2
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-white/90
        shadow-lg
        transition
        hover:bg-brand-primary
        hover:text-white
        "

        >

        <ChevronRight size={20}/>

        </button>




        {/* DOTS */}

        <div
        className="
        absolute
        bottom-5
        left-1/2
        z-20
        flex
        -translate-x-1/2
        gap-2
        "
        >

        {
          slides.map((slide,index)=>(

            <button

            key={slide.id}

            onClick={()=>setCurrent(index)}

            className={`
            h-2.5
            rounded-full
            transition-all
            ${
              current===index
              ?
              "w-8 bg-brand-primary"
              :
              "w-2.5 bg-white/70"
            }
            `}

            />

          ))
        }

        </div>



      </div>


    </div>

  );

}