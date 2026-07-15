"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Eye,
  Star,
  Sparkles,
  Truck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Minus,
  X,
  AlertCircle,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { getProducts } from "@/services/productService";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import { MOCK_PRODUCTS, Product } from "@/constants/mockProducts";

/* ------------------------------------------------------------------ */
/*  Design tokens (kept as inline Tailwind values so nothing else in   */
/*  the app needs to change). Rose is now #EA147D — a vivid magenta-   */
/*  pink — everything around it is tuned to read calmer, warmer, and   */
/*  more editorial.                                                    */
/*                                                                      */
/*  ink       #1E0E16   headings / primary text                        */
/*  rose      #EA147D   brand accent                                   */
/*  roseDeep  #B60F61   hover / pressed states                         */
/*  gold      #C9A46B   rating stars, dividers, small accents          */
/*  muted     #8C6169   secondary / caption text                       */
/*  blush     #FBEDEF   surfaces, tints                                */
/*  hairline  #F0DEE1   borders                                        */
/*  canvas    #FFFBF8   page background                                */
/*                                                                      */
/*  Fonts: pair the existing display serif with a cleaner grotesk for  */
/*  body copy so long text reads calmer next to the display headings.  */
/*  Add to tailwind.config.js:                                         */
/*    fontFamily: {                                                    */
/*      display: ['var(--font-playfair)', 'serif'],                    */
/*      sans: ['var(--font-manrope)', 'sans-serif'],                   */
/*    }                                                                 */
/*  And in layout.tsx:                                                 */
/*    import { Playfair_Display, Manrope } from 'next/font/google';    */
/*    const playfair = Playfair_Display({ subsets: ['latin'],          */
/*      variable: '--font-playfair', weight: ['500','700','900'] });   */
/*    const manrope = Manrope({ subsets: ['latin'],                    */
/*      variable: '--font-manrope', weight: ['400','500','600','700']});*/
/*    <body className={`${playfair.variable} ${manrope.variable}`}>    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

function getProductImage(product: Product) {
  if (product.images && product.images.length > 0) return product.images[0];
  return "/placeholder.jpg";
}

function formatPrice(price: number | string) {
  return `LKR ${Number(price).toLocaleString()}`;
}

/* ------------------------------------------------------------------ */
/*  SectionEyebrow — small recurring signature: a rose→gold rule       */
/*  under every section label, a quiet echo of the "glass slipper"     */
/*  motif without being literal.                                       */
/* ------------------------------------------------------------------ */

function SectionEyebrow({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "flex flex-col items-center" : ""}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#EA147D]">
        {children}
      </span>
      <span
        className="mt-2.5 block h-[3px] w-10 rounded-full"
        style={{
          background: "linear-gradient(90deg, #EA147D 0%, #C9A46B 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StarRating — gold instead of stock yellow so ratings read as part  */
/*  of the palette rather than a generic browser-default star.         */
/* ------------------------------------------------------------------ */

function StarRating({ rating, size = 11 }: { rating?: number; size?: number }) {
  return (
    <div className="flex text-[#C9A46B]">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star
          key={idx}
          size={size}
          fill={idx < Math.floor(rating || 5) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.75}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ProductCard — used by New Arrivals, Featured, and Best Sellers.    */
/*  Previously this markup was duplicated three times; badge label,    */
/*  color, and quick-actions now come from props.                      */
/* ------------------------------------------------------------------ */

type BadgeVariant = "new" | "featured" | "bestseller";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  new: "bg-white text-[#EA147D]",
  featured: "bg-[#EA147D] text-white",
  bestseller: "bg-[#1E0E16] text-white",
};

interface ProductCardProps {
  product: Product;
  index: number;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  isWishlisted: boolean;
  reduceMotion: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

function ProductCard({
  product,
  index,
  badgeLabel,
  badgeVariant,
  isWishlisted,
  reduceMotion,
  onToggleWishlist,
  onQuickView,
}: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : index * 0.08 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-[#F5E3E1] shadow-sm border border-[#F0DEE1] transition-shadow duration-300 group-hover:shadow-lg">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm ${BADGE_STYLES[badgeVariant]}`}
        >
          {badgeLabel}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] focus-visible:ring-offset-2"
        >
          <Heart
            size={15}
            fill={isWishlisted ? "#EA147D" : "none"}
            stroke={isWishlisted ? "#EA147D" : "#1E0E16"}
          />
        </button>

        {/* Quick Shop: visible on hover for desktop, always visible on touch devices via opacity-100 on small screens is skipped in favor of a persistent bottom strip on tap-friendly layouts */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            onClick={() => onQuickView(product)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-xs font-bold uppercase tracking-wider text-[#1E0E16] shadow-md transition hover:bg-[#FBEDEF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D]"
          >
            <Eye size={14} /> Quick Shop
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-2 px-1">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6169]">
            {product.category}
          </h3>
          <h4 className="mt-1 font-display text-[15px] font-bold leading-snug text-[#1E0E16] group-hover:text-[#EA147D] transition-colors line-clamp-1">
            {product.name}
          </h4>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8C6169]">
            <StarRating rating={product.rating} />
            <span>({product.reviewsCount || 10})</span>
          </div>
          <p className="mt-1.5 font-sans text-sm font-bold text-[#EA147D]">
            {formatPrice(product.price)}
          </p>
        </div>

        <button
          onClick={() => onQuickView(product)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F0DEE1] bg-white text-[#1E0E16] transition hover:bg-[#EA147D] hover:text-white hover:border-[#EA147D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] focus-visible:ring-offset-2"
          aria-label={`Select size and color for ${product.name}`}
        >
          <ShoppingBag size={14} />
        </button>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  ProductCardSkeleton — shown while the initial fetch is in flight   */
/* ------------------------------------------------------------------ */

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-3xl bg-[#F5E3E1] border border-[#F0DEE1]" />
      <div className="mt-4 space-y-2 px-1">
        <div className="h-2.5 w-16 rounded-full bg-[#F0DEE1]" />
        <div className="h-3.5 w-3/4 rounded-full bg-[#F0DEE1]" />
        <div className="h-3 w-20 rounded-full bg-[#F0DEE1]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const reduceMotion = Boolean(useReducedMotion());

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Active tab for New Arrivals
  const [newArrivalTab, setNewArrivalTab] = useState("All");

  // Hero Slider State
  const [heroIndex, setHeroIndex] = useState(0);

  // Testimonials Slider State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Quick View Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewSize, setQuickViewSize] = useState("");
  const [quickViewColor, setQuickViewColor] = useState("");
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [quickViewError, setQuickViewError] = useState("");

  // Newsletter State
  const [email, setEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Load products from DB (with fallback to MOCK_PRODUCTS)
  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        if (active) {
          if (data && data.length > 0) {
            setDbProducts(data as Product[]);
          } else {
            setDbProducts(MOCK_PRODUCTS);
          }
        }
      } catch (error) {
        console.error("Error loading products on home page:", error);
        if (active) setDbProducts(MOCK_PRODUCTS);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, []);

  // Sync products list
  const allProducts = useMemo(() => {
    return dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS;
  }, [dbProducts]);

  // Hero slides data
  const heroSlides = useMemo(
    () => [
      {
        image: "/images/hero1.jpg",
        tag: "Step Into Elegance",
        title: "Find Your Perfect Pair",
        desc: "Discover stylish footwear designed to bring confidence, comfort, and elegance to every step you take.",
        link: "/shop?category=Heels",
      },
      {
        image: "/images/hero2.jpg",
        tag: "New Season Collection",
        title: "Style That Speaks for You",
        desc: "Explore beautiful designs crafted for every occasion, from everyday wear to your most special moments.",
        link: "/shop?category=Heels",
      },
      {
        image: "/images/hero3.jpg",
        tag: "Fashion Meets Comfort",
        title: "Walk with Confidence",
        desc: "Experience the perfect blend of modern fashion, premium quality, and all-day comfort in every pair.",
        link: "/shop?category=Heels",
      },
    ],
    []
  );

  // Auto-scroll Hero Slider — paused if the visitor prefers reduced motion
  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length, reduceMotion]);

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  // Categories list
  const categorySections = [
    {
      name: "Heels",
      subtitle: "Editorial Heights",
      desc: "Pointed toes, crystal details, and stiletto profiles designed to turn heads.",
      img: "/images/heels.jpg",
      span: "md:col-span-2",
    },
    {
      name: "Sandals",
      subtitle: "Casual Elegance",
      desc: "Strappy leather structures that blend coastal freedom with premium detail.",
      img: "/images/sandals.jpg",
      span: "md:col-span-1",
    },
    {
      name: "Flats",
      subtitle: "Everyday Statement",
      desc: "Low-profile comfort dressed in rich textures and elegant buckle finishes.",
      img: "/images/flats.jpg",
      span: "md:col-span-1",
    },
    {
      name: "Slippers",
      subtitle: "Plush Indulgence",
      desc: "Premium cushioning and warmth for rest and off-duty weekend relaxation.",
      img: "/images/slippers.jpg",
      span: "md:col-span-2",
    },
  ];

  // Filtered lists
  const newArrivals = useMemo(() => allProducts.slice(0, 4), [allProducts]);

  const filteredNewArrivals = useMemo(
    () =>
      newArrivals.filter(
        (p) => newArrivalTab === "All" || p.category?.toLowerCase() === newArrivalTab.toLowerCase()
      ),
    [newArrivals, newArrivalTab]
  );

  const featuredProducts = useMemo(() => {
    const featured = allProducts.filter((p) => p.featured);
    return featured.length > 0 ? featured.slice(0, 4) : allProducts.slice(2, 6);
  }, [allProducts]);

  const bestSellingProducts = useMemo(() => {
    const bestSellers = allProducts.filter((p) => p.bestSeller);
    return bestSellers.length > 0 ? bestSellers.slice(0, 4) : allProducts.slice(4, 8);
  }, [allProducts]);

  // Testimonials data
  const testimonials = [
    {
      quote:
        "The Crystal Grace heels made my wedding day. I danced until 3 AM without a single complaint from my feet, and I lost count of the compliments.",
      name: "Nisansala De Silva",
      role: "Verified Bride",
      product: "Cinderella Crystal Heels",
      rating: 5,
    },
    {
      quote:
        "Finding elegant flats that don't bite at the heel is usually a challenge here in Homagama. These fit properly from day one.",
      name: "Vihangi Wickramasinghe",
      role: "Verified Buyer",
      product: "Velvet Blush Flats",
      rating: 5,
    },
    {
      quote:
        "Shipping was fast and the support team sorted my size exchange without any hassle. That's what earns repeat customers.",
      name: "Priyantha Jayasekara",
      role: "Verified Gift Purchaser",
      product: "Starlight Gold Pumps",
      rating: 5,
    },
  ];

  // Auto-scroll Testimonials — paused if reduced motion is preferred
  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length, reduceMotion]);

  // Instagram photos
  const instagramPhotos = [
    { src: "/images/insta_heels.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_sandals.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_flats.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_bridal.jpg", tag: "@CinderellaWear" },
  ];

  // Open Quick View
  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewSize(product.sizes?.[0] || "");
    setQuickViewColor(product.colors?.[0] || "");
    setQuickViewQty(1);
    setQuickViewError("");
  };

  // Add item from Quick View to Cart
  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;
    if (!quickViewSize) {
      setQuickViewError("Please select a size before adding to your bag.");
      return;
    }
    if (!quickViewColor) {
      setQuickViewError("Please select a color before adding to your bag.");
      return;
    }

    addToCart({
      id: String(selectedProduct.id),
      name: selectedProduct.name,
      price: Number(selectedProduct.price),
      image: getProductImage(selectedProduct),
      size: quickViewSize,
      color: quickViewColor,
      sizes: selectedProduct.sizes || [],
      colors: selectedProduct.colors || [],
      quantity: quickViewQty,
    });

    setSelectedProduct(null);
    router.push("/cart");
  };

  // Toggle wishlist from card.
  // NOTE: id is always normalized to a string here — the wishlist store
  // keys entries by string id, so this must match isInWishlist(String(id))
  // everywhere below or the heart icon will desync from the store.
  const handleToggleWishlist = (product: Product) => {
    toggleWishlist({
      id: String(product.id),
      name: product.name,
      price: Number(product.price),
      image: getProductImage(product),
    });
  };

  // Handle email signup
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setNewsletterError("That doesn't look like a valid email address.");
      return;
    }
    setNewsletterError("");
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 6000);
  };

  return (
    <main className="overflow-hidden bg-[#FFFBF8] text-[#1E0E16] antialiased">
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-b from-[#FCE9F0] via-[#FDF3F6] to-white lg:min-h-screen">
        {/* Abstract Glow Elements */}
        <div className="absolute -left-36 -top-36 h-[500px] w-[500px] rounded-full bg-[#EA147D]/5 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-[#C9A46B]/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* HERO LEFT - TEXT CONTENT */}
            <div className="relative z-10 lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EA147D]/10 px-4 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#EA147D]">
                <Sparkles size={12} className="motion-safe:animate-pulse" />
                Sri Lanka's Premium Footwear Boutique
              </span>

              <div className="mt-6 relative h-[220px] sm:h-[260px] md:h-[300px] lg:h-[350px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -30 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8C6169]">
                      {heroSlides[heroIndex].tag}
                    </p>
                    <h1 className="mt-3 font-display text-4xl font-black leading-[1.06] tracking-tight text-[#1E0E16] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                      {heroSlides[heroIndex].title}
                    </h1>
                    <span
                      className="mt-4 block h-[3px] w-16 rounded-full"
                      style={{ background: "linear-gradient(90deg, #EA147D 0%, #C9A46B 100%)" }}
                    />
                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#8C6169] sm:text-base md:text-[17px]">
                      {heroSlides[heroIndex].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#EA147D] to-[#F0508E] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_8px_30px_rgba(234,20,125,0.25)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_8px_35px_rgba(234,20,125,0.4)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] focus-visible:ring-offset-2"
                >
                  Shop New Arrivals
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-[#F0DEE1] bg-white/70 px-8 py-4 text-sm font-semibold tracking-wide text-[#1E0E16] backdrop-blur-md transition duration-300 hover:bg-[#FBEDEF] hover:border-[#EA147D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] focus-visible:ring-offset-2"
                >
                  Our Story
                </Link>
              </div>

              {/* Slider Controls */}
              <div className="mt-12 flex items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevHero}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F0DEE1] bg-white text-[#1E0E16] transition duration-200 hover:border-[#EA147D] hover:bg-[#FBEDEF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D]"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextHero}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F0DEE1] bg-white text-[#1E0E16] transition duration-200 hover:border-[#EA147D] hover:bg-[#FBEDEF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D]"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Dots indicator */}
                <div className="flex gap-1.5" role="tablist" aria-label="Hero slides">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroIndex(idx)}
                      role="tab"
                      aria-selected={heroIndex === idx}
                      aria-label={`Show ${slide.title}`}
                      className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] ${
                        heroIndex === idx ? "w-6 bg-[#EA147D]" : "w-2 bg-[#F0DEE1]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* HERO RIGHT - ANIMATED GALLERY IMAGE */}
            <div className="relative flex justify-center lg:col-span-6">
              <div className="relative h-[450px] w-full max-w-[340px] overflow-hidden rounded-[2.5rem] border border-[#F0DEE1] bg-white p-3 shadow-2xl sm:h-[550px] sm:max-w-[420px] md:max-w-[460px] lg:h-[600px] lg:max-w-[500px]">
                <div className="absolute inset-4 rounded-[2rem] border border-[#EA147D]/10 pointer-events-none z-20" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-full w-full overflow-hidden rounded-[2rem]"
                  >
                    <img
                      src={heroSlides[heroIndex].image}
                      alt={heroSlides[heroIndex].title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white z-10">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FDF0F5]">Comfort First</span>
                        <h4 className="font-display text-lg font-bold">{heroSlides[heroIndex].title}</h4>
                      </div>
                      <Link
                        href="/shop"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition hover:bg-white hover:text-[#EA147D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        aria-label={`Shop ${heroSlides[heroIndex].title}`}
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Float Card Trust Indicator */}
              <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-[#FBEDEF] bg-white/90 p-4 shadow-lg backdrop-blur-md sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EA147D]/10 text-[#EA147D]">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#8C6169] uppercase tracking-wider">Fast Delivery</p>
                  <p className="text-xs font-semibold text-[#1E0E16]">Cash on delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow align="center">Curated Collections</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[#1E0E16] sm:text-4xl md:text-5xl">
              Shop by Silhouette
            </h2>
            <p className="mt-4 text-sm text-[#8C6169] sm:text-base">
              Aisle, boardroom, or a quiet evening at home — find the shape built for where you're headed.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {categorySections.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.1 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-[2rem] border border-[#F0DEE1] bg-[#FBEDEF] shadow-sm transition-all duration-500 hover:shadow-xl ${cat.span}`}
              >
                <div className="relative h-72 overflow-hidden sm:h-80 md:h-[350px]">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E0E16]/75 via-[#1E0E16]/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FDF0F5]/85">
                    {cat.subtitle}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-black sm:text-3xl">{cat.name}</h3>
                  <p className="mt-2 line-clamp-2 text-xs text-[#FDF0F5]/80 sm:text-sm">{cat.desc}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                    >
                      Browse {cat.name}
                      <ArrowRight size={12} />
                    </Link>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#EA147D]">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="bg-gradient-to-b from-white to-[#FDF3F6] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionEyebrow>Fresh Off The Bench</SectionEyebrow>
              <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[#1E0E16] sm:text-4xl md:text-5xl">
                New Arrivals
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter new arrivals by category">
              {["All", "Heels", "Sandals", "Flats"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setNewArrivalTab(tab)}
                  role="tab"
                  aria-selected={newArrivalTab === tab}
                  className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] focus-visible:ring-offset-2 ${
                    newArrivalTab === tab
                      ? "bg-[#1E0E16] text-white"
                      : "bg-white text-[#8C6169] border border-[#F0DEE1] hover:bg-[#FBEDEF]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list */}
          {loading ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredNewArrivals.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {filteredNewArrivals.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  badgeLabel="New"
                  badgeVariant="new"
                  isWishlisted={isInWishlist(String(product.id))}
                  reduceMotion={reduceMotion}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={handleOpenQuickView}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#F0DEE1] bg-white/60 py-16 text-center">
              <p className="text-sm text-[#8C6169]">
                No new {newArrivalTab.toLowerCase()} just yet — the next drop is on its way.
              </p>
              <button
                onClick={() => setNewArrivalTab("All")}
                className="mt-4 rounded-full bg-[#1E0E16] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#150910] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] focus-visible:ring-offset-2"
              >
                View all new arrivals
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <SectionEyebrow align="center">Boutique Highlights</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[#1E0E16] sm:text-4xl md:text-5xl">
              Featured Pieces
            </h2>
            <p className="mt-3 text-sm text-[#8C6169]">
              Chosen by our stylist team for craftsmanship and detail that hold up to a closer look.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    badgeLabel="Stylist Pick"
                    badgeVariant="featured"
                    isWishlisted={isInWishlist(String(product.id))}
                    reduceMotion={reduceMotion}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={handleOpenQuickView}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* 5. BEST SELLING PRODUCTS */}
      <section className="bg-gradient-to-b from-[#FDF3F6] to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <SectionEyebrow align="center">Customer Favorites</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[#1E0E16] sm:text-4xl md:text-5xl">
              Best Sellers
            </h2>
            <p className="mt-3 text-sm text-[#8C6169]">
              The most reordered, most reviewed, and fastest-selling styles this season.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : bestSellingProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    badgeLabel="Best Seller"
                    badgeVariant="bestseller"
                    isWishlisted={isInWishlist(String(product.id))}
                    reduceMotion={reduceMotion}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={handleOpenQuickView}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* 6. WHY SHOP WITH US */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#F0DEE1] bg-[#FBEDEF]/50 px-6 py-16 text-center sm:px-12 md:py-20">
            <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#EA147D]/5 blur-2xl" />
            <div className="absolute -bottom-16 right-0 h-44 w-44 rounded-full bg-[#C9A46B]/10 blur-2xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <SectionEyebrow align="center">Premium Standards</SectionEyebrow>
              <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[#1E0E16] sm:text-4xl md:text-5xl">
                The Cinderella Promise
              </h2>
              <p className="mt-4 text-sm text-[#8C6169] sm:text-base leading-relaxed">
                Footwear shouldn't force a choice between comfort and elegance. Every pair is built with
                cushioned support and tested for balance before it reaches you.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Sparkles className="h-6 w-6 text-[#EA147D]" />,
                  title: "Premium Materials",
                  desc: "Carefully sourced fabrics and soft synthetic leathers, built to last and to look it.",
                },
                {
                  icon: <Star className="h-6 w-6 text-[#EA147D]" />,
                  title: "Designed for Comfort",
                  desc: "A cushioned inner sole layer absorbs shock and eases pressure through a full day of wear.",
                },
                {
                  icon: <Truck className="h-6 w-6 text-[#EA147D]" />,
                  title: "Fast Delivery",
                  desc: "Cash-on-delivery to your door across Colombo, Kandy, Negombo, and islandwide.",
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 text-[#EA147D]" />,
                  title: "Secure Checkout",
                  desc: "Pay on delivery or by direct bank transfer — whichever you trust more.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#F0DEE1] bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBEDEF] text-[#EA147D]">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-base font-bold text-[#1E0E16]">{item.title}</h3>
                  <p className="mt-2 text-xs text-[#8C6169] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRENDING COLLECTIONS */}
      <section className="bg-white pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Promo Panel 1 */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#F0DEE1] bg-[#1E0E16] text-white">
              <div className="absolute inset-0 opacity-40 transition-transform duration-700 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">
                <img src="/images/hero1.jpg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1E0E16]/95 via-[#1E0E16]/75 to-transparent z-10" />

              <div className="relative z-20 flex flex-col justify-center px-8 py-16 md:px-12 md:py-24 max-w-md">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A46B]">Seasonal Luxury</span>
                <h3 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">
                  The Bridal Collection
                </h3>
                <p className="mt-4 text-xs text-[#FCE9F0]/85 sm:text-sm leading-relaxed">
                  Pre-order custom wedding pairs fitted with extra-padded arches, made to last from
                  the ceremony through the last dance.
                </p>
                <div className="mt-8">
                  <Link
                    href="/shop?category=Heels"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#1E0E16] shadow-md transition hover:bg-[#FBEDEF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    View Bridal Edit
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Promo Panel 2 */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#F0DEE1] bg-[#EA147D] text-white">
              <div className="absolute inset-0 opacity-45 transition-transform duration-700 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">
                <img src="/images/about-hero.jpg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#EA147D]/95 via-[#EA147D]/75 to-transparent z-10" />

              <div className="relative z-20 flex flex-col justify-center px-8 py-16 md:px-12 md:py-24 max-w-md">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/90">Daily Staples</span>
                <h3 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">
                  Casual Chic Comfort
                </h3>
                <p className="mt-4 text-xs text-[#FDF0F5]/85 sm:text-sm leading-relaxed">
                  Breathable leathers and flexible cork soles, built for errands that shouldn't feel
                  like a chore on your feet.
                </p>
                <div className="mt-8">
                  <Link
                    href="/shop?category=Sandals"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#EA147D] shadow-md transition hover:bg-[#FBEDEF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Shop Sandals
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="bg-gradient-to-b from-white to-[#FBEDEF]/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow align="center">Real Stories</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[#1E0E16] sm:text-4xl md:text-5xl">
              Loved by Cinderella Customers
            </h2>
          </div>

          <div className="mt-12 relative mx-auto max-w-4xl px-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#F0DEE1] bg-white p-8 shadow-sm md:p-12">
              <span className="absolute right-8 top-6 font-display text-8xl font-black text-[#FBEDEF] pointer-events-none z-0">
                "
              </span>

              <div className="relative z-10" aria-live="polite">
                <StarRating rating={testimonials[testimonialIndex].rating} size={16} />

                <blockquote className="mt-6 font-display text-base italic leading-relaxed text-[#1E0E16] sm:text-lg md:text-xl">
                  "{testimonials[testimonialIndex].quote}"
                </blockquote>

                <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-[#1E0E16]">
                      {testimonials[testimonialIndex].name}
                    </h4>
                    <p className="text-xs text-[#8C6169] uppercase tracking-wider font-semibold">
                      {testimonials[testimonialIndex].role}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBEDEF] border border-[#F0DEE1] px-3.5 py-1 text-xs font-medium text-[#EA147D]">
                    Purchased: {testimonials[testimonialIndex].product}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3" role="tablist" aria-label="Customer testimonials">
              {testimonials.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  role="tab"
                  aria-selected={testimonialIndex === idx}
                  aria-label={`Show testimonial from ${t.name}`}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] ${
                    testimonialIndex === idx ? "w-8 bg-[#EA147D]" : "w-2.5 bg-[#F0DEE1]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM GALLERY */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <SectionEyebrow align="center">Social Inspiration</SectionEyebrow>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[#1E0E16] sm:text-4xl md:text-5xl">
              Style Inspiration
            </h2>
            <p className="mt-3 text-sm text-[#8C6169]">
              Tag <strong className="text-[#EA147D]">#CinderellaSteps</strong> for a chance to be featured here.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {instagramPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-[2rem] border border-[#F0DEE1]"
              >
                <img
                  src={photo.src}
                  alt="Customer styling a Cinderella footwear look"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1E0E16]/60 text-white opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                  <FaInstagram size={28} className="text-[#FDF0F5]" />
                  <span className="mt-3 text-xs font-semibold uppercase tracking-wider">{photo.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK VIEW MODAL COMPONENT */}
      <AnimatePresence>
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${selectedProduct.name}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setSelectedProduct(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95, y: reduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95, y: reduceMotion ? 0 : 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-[2rem] bg-white shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FBEDEF] text-[#1E0E16] hover:bg-[#F0DEE1] transition z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D]"
                aria-label="Close quick view"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-[3/4] md:aspect-auto md:h-full min-h-[300px] overflow-hidden bg-[#F5E3E1]">
                  <img
                    src={getProductImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#EA147D]">
                      {selectedProduct.category}
                    </span>

                    <h3 className="mt-2 font-display text-2xl font-black text-[#1E0E16]">
                      {selectedProduct.name}
                    </h3>

                    <p className="mt-2 font-sans text-xl font-extrabold text-[#EA147D]">
                      {formatPrice(selectedProduct.price)}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <StarRating rating={selectedProduct.rating} size={12} />
                      <span className="text-xs text-[#8C6169]">
                        ({selectedProduct.reviewsCount || 10} verified reviews)
                      </span>
                    </div>

                    <p className="mt-4 text-xs text-[#8C6169] leading-relaxed sm:text-sm">
                      {selectedProduct.description}
                    </p>

                    {/* Sizes Selection */}
                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1E0E16]">
                          Select Shoe Size
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedProduct.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                setQuickViewSize(size);
                                setQuickViewError("");
                              }}
                              aria-pressed={quickViewSize === size}
                              className={`h-9 w-12 rounded-xl text-xs font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] ${
                                quickViewSize === size
                                  ? "bg-[#EA147D] border-[#EA147D] text-white"
                                  : "bg-white border-[#F0DEE1] text-[#1E0E16] hover:border-[#EA147D]/30"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors Selection */}
                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mt-5">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1E0E16]">
                          Select Color Variant
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedProduct.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                setQuickViewColor(color);
                                setQuickViewError("");
                              }}
                              aria-pressed={quickViewColor === color}
                              className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] ${
                                quickViewColor === color
                                  ? "bg-[#EA147D] border-[#EA147D] text-white"
                                  : "bg-white border-[#F0DEE1] text-[#1E0E16] hover:border-[#EA147D]/30"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity selectors */}
                    <div className="mt-5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1E0E16]">Quantity</h4>
                      <div className="mt-2 inline-flex items-center gap-4 rounded-xl border border-[#F0DEE1] px-3 py-1.5">
                        <button
                          onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                          className="text-[#1E0E16] transition active:scale-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center" aria-live="polite">
                          {quickViewQty}
                        </span>
                        <button
                          onClick={() => setQuickViewQty((q) => q + 1)}
                          className="text-[#1E0E16] transition active:scale-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {quickViewError && (
                      <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-red-500">
                        <AlertCircle size={13} /> {quickViewError}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={handleConfirmAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#EA147D] text-white text-xs font-bold uppercase tracking-wider py-4 transition duration-300 hover:bg-[#B60F61] active:scale-97 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D] focus-visible:ring-offset-2"
                    >
                      <ShoppingBag size={14} /> Add To Bag
                    </button>

                    <button
                      onClick={() => handleToggleWishlist(selectedProduct)}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F0DEE1] bg-white text-[#1E0E16] transition hover:border-[#EA147D] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA147D]"
                      aria-label={
                        isInWishlist(String(selectedProduct.id))
                          ? `Remove ${selectedProduct.name} from wishlist`
                          : `Add ${selectedProduct.name} to wishlist`
                      }
                      aria-pressed={isInWishlist(String(selectedProduct.id))}
                    >
                      <Heart
                        size={18}
                        fill={isInWishlist(String(selectedProduct.id)) ? "#EA147D" : "none"}
                        stroke={isInWishlist(String(selectedProduct.id)) ? "#EA147D" : "#1E0E16"}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}