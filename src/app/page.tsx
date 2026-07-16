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
import HeroSlider from "@/components/HeroSlider";

function getProductImage(product: Product) {
  if (product.images && product.images.length > 0) return product.images[0];
  return "/placeholder.jpg";
}

function formatPrice(price: number | string) {
  return `LKR ${Number(price).toLocaleString()}`;
}


function SectionEyebrow({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "flex flex-col items-center" : ""}>
      <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-pink-500">
        {children}
      </span>
      <span className="mt-2.5 block h-[3px] w-10 rounded-full bg-gradient-to-r from-pink-600 to-rose-500" />
    </div>
  );
}

function StarRating({ rating, size = 11 }: { rating?: number; size?: number }) {
  return (
    <div className="flex text-amber-400">
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


type BadgeVariant = "new" | "featured" | "bestseller";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  new: "bg-white text-pink-600",
  featured: "bg-gradient-to-r from-pink-600 to-rose-500 text-white",
  bestseller: "bg-gray-900 text-white",
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
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-pink-50 border border-pink-100 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
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
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
        >
          <Heart
            size={15}
            fill={isWishlisted ? "#DB2777" : "none"}
            stroke={isWishlisted ? "#DB2777" : "#111827"}
          />
        </button>

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            onClick={() => onQuickView(product)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-md transition hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          >
            <Eye size={14} /> Quick Shop
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-2 px-1">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {product.category}
          </h3>
          <h4 className="mt-1 text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
            {product.name}
          </h4>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
            <StarRating rating={product.rating} />
            <span>({product.reviewsCount || 10})</span>
          </div>
          <p className="mt-1.5 text-sm font-bold text-pink-600">
            {formatPrice(product.price)}
          </p>
        </div>

        <button
          onClick={() => onQuickView(product)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-900 transition hover:bg-pink-600 hover:text-white hover:border-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
          aria-label={`Select size and color for ${product.name}`}
        >
          <ShoppingBag size={14} />
        </button>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  ProductCardSkeleton                                                */
/* ------------------------------------------------------------------ */

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-[2rem] bg-pink-50 border border-pink-100" />
      <div className="mt-4 space-y-2 px-1">
        <div className="h-2.5 w-16 rounded-full bg-pink-100" />
        <div className="h-3.5 w-3/4 rounded-full bg-pink-100" />
        <div className="h-3 w-20 rounded-full bg-pink-100" />
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

  const [newArrivalTab, setNewArrivalTab] = useState("All");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewSize, setQuickViewSize] = useState("");
  const [quickViewColor, setQuickViewColor] = useState("");
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [quickViewError, setQuickViewError] = useState("");

  const [email, setEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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

  const allProducts = useMemo(() => {
    return dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS;
  }, [dbProducts]);

  const categorySections = [
    {
      name: "Heels",
      subtitle: "Editorial Heights",
      desc: "Pointed toes, crystal details, and stiletto profiles designed to turn heads.",
      img: "/images/heels.jpg",
    },
    {
      name: "Sandals",
      subtitle: "Casual Elegance",
      desc: "Strappy leather structures that blend coastal freedom with premium detail.",
      img: "/images/sandals.jpg",
    },
    {
      name: "Flats",
      subtitle: "Everyday Statement",
      desc: "Low-profile comfort dressed in rich textures and elegant buckle finishes.",
      img: "/images/flats.jpg",
    },
    {
      name: "Slippers",
      subtitle: "Plush Indulgence",
      desc: "Premium cushioning and warmth for rest and off-duty weekend relaxation.",
      img: "/images/slippers.jpg",
    },
  ];

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

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length, reduceMotion]);

  const instagramPhotos = [
    { src: "/images/insta_1.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_2.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_3.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_4.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_5.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_6.jpg", tag: "@CinderellaWear" }, 
    { src: "/images/insta_7.jpg", tag: "@CinderellaWear" },
    { src: "/images/insta_8.jpg", tag: "@CinderellaWear" },
  ];

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewSize(product.sizes?.[0] || "");
    setQuickViewColor(product.colors?.[0] || "");
    setQuickViewQty(1);
    setQuickViewError("");
  };

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
    <main className="overflow-hidden bg-white text-gray-900 antialiased">
      {/* 1. HERO SECTION */}
      <HeroSlider />

      {/* 2. FEATURED CATEGORIES — single row, four equal cards, tighter side gutters */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow align="center">Curated Collections</SectionEyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Shop by Silhouette
            </h2>
            <p className="mt-4 text-sm text-gray-600 sm:text-base">
              Aisle, boardroom, or a quiet evening at home — find the shape built for where you're headed.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4 lg:gap-7">
            {categorySections.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-[1.75rem]"
                >
                  <div className="relative overflow-hidden rounded-[1.75rem] border border-pink-100/80 bg-white shadow-sm transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-pink-200/40">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden sm:h-64 md:h-80">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/85" />

                      {/* Decorative ring on hover */}
                      <div className="pointer-events-none absolute inset-3 rounded-[1.4rem] border border-white/0 transition-all duration-500 group-hover:border-white/25" />

                      {/* Count / subtitle pill */}
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-pink-600 shadow-sm backdrop-blur-sm sm:text-[10px]">
                        {cat.subtitle}
                      </span>
                    </div>

                    {/* Text content overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5 md:p-6">
                      <h3 className="text-xl font-bold tracking-tight sm:text-2xl md:text-[1.65rem]">
                        {cat.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-pink-50/85 sm:text-xs">
                        {cat.desc}
                      </p>

                      <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white sm:text-xs">
                        <span className="relative">
                          Shop Now
                          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowRight
                          size={13}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="bg-gradient-to-b from-white to-pink-50/60 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionEyebrow>Fresh Off The Bench</SectionEyebrow>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                New Arrivals
              </h2>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter new arrivals by category">
              {["All", "Heels", "Sandals", "Flats"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setNewArrivalTab(tab)}
                  role="tab"
                  aria-selected={newArrivalTab === tab}
                  className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 ${
                    newArrivalTab === tab
                      ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white"
                      : "bg-white text-gray-600 border border-pink-100 hover:bg-pink-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

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
            <div className="mt-10 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-pink-200 bg-white/60 py-16 text-center">
              <p className="text-sm text-gray-600">
                No new {newArrivalTab.toLowerCase()} just yet — the next drop is on its way.
              </p>
              <button
                onClick={() => setNewArrivalTab("All")}
                className="mt-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
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
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Discover Cinderella’s signature styles — beautifully crafted footwear that blends timeless elegance, luxurious comfort, and everyday confidence.
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
      <section className="bg-gradient-to-b from-pink-50/60 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <SectionEyebrow align="center">Customer Favorites</SectionEyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Best Sellers
            </h2>
            <p className="mt-3 text-sm text-gray-600">
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
          <div className="relative overflow-hidden rounded-[2.5rem] border border-pink-100 bg-pink-50/60 px-6 py-16 text-center sm:px-12 md:py-20">
            <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-pink-300/20 blur-3xl" />
            <div className="absolute -bottom-16 right-0 h-44 w-44 rounded-full bg-rose-200/30 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <SectionEyebrow align="center">Premium Standards</SectionEyebrow>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                The Cinderella Promise
              </h2>
              <p className="mt-4 text-sm text-gray-600 sm:text-base leading-relaxed">
                Footwear shouldn't force a choice between comfort and elegance. Every pair is built with
                cushioned support and tested for balance before it reaches you.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Sparkles className="h-7 w-7 text-pink-600" />,
                  title: "Premium Materials",
                  desc: "Carefully sourced fabrics and soft synthetic leathers, built to last and to look it.",
                },
                {
                  icon: <Star className="h-7 w-7 text-pink-600" />,
                  title: "Designed for Comfort",
                  desc: "A cushioned inner sole layer absorbs shock and eases pressure through a full day of wear.",
                },
                {
                  icon: <Truck className="h-7 w-7 text-pink-600" />,
                  title: "Fast Delivery",
                  desc: "Cash-on-delivery to your door across Colombo, Kandy, Negombo, and islandwide.",
                },
                {
                  icon: <ShieldCheck className="h-7 w-7 text-pink-600" />,
                  title: "Secure Checkout",
                  desc: "Pay on delivery or by direct bank transfer — whichever you trust more.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="bg-gradient-to-b from-white to-pink-50/60 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow align="center">Real Stories</SectionEyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Loved by Cinderella Customers
            </h2>
          </div>

          <div className="mt-12 relative mx-auto max-w-4xl px-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-pink-100 bg-white p-8 shadow-sm md:p-12">
              <span className="absolute right-8 top-6 text-8xl font-black text-pink-50 pointer-events-none z-0">
                "
              </span>

              <div className="relative z-10" aria-live="polite">
                <StarRating rating={testimonials[testimonialIndex].rating} size={16} />

                <blockquote className="mt-6 text-base italic leading-relaxed text-gray-900 sm:text-lg md:text-xl">
                  "{testimonials[testimonialIndex].quote}"
                </blockquote>

                <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {testimonials[testimonialIndex].name}
                    </h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      {testimonials[testimonialIndex].role}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-100 px-3.5 py-1 text-xs font-medium text-pink-600">
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
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
                    testimonialIndex === idx ? "w-8 bg-pink-600" : "w-2.5 bg-pink-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <SectionEyebrow align="center">Social Inspiration</SectionEyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Style Inspiration
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Tag <strong className="text-pink-600">#CinderellaSteps</strong> for a chance to be featured here.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {instagramPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-[2rem] border border-pink-100"
              >
                <img
                  src={photo.src}
                  alt="Customer styling a Cinderella footwear look"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/60 text-white opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                  <FaInstagram size={28} className="text-pink-50" />
                  <span className="mt-3 text-xs font-semibold uppercase tracking-wider">{photo.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
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
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-gray-900 hover:bg-pink-100 transition z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                aria-label="Close quick view"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-[3/4] md:aspect-auto md:h-full min-h-[300px] overflow-hidden bg-pink-50">
                  <img
                    src={getProductImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-600">
                      {selectedProduct.category}
                    </span>

                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                      {selectedProduct.name}
                    </h3>

                    <p className="mt-2 text-xl font-extrabold text-pink-600">
                      {formatPrice(selectedProduct.price)}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <StarRating rating={selectedProduct.rating} size={12} />
                      <span className="text-xs text-gray-500">
                        ({selectedProduct.reviewsCount || 10} verified reviews)
                      </span>
                    </div>

                    <p className="mt-4 text-xs text-gray-600 leading-relaxed sm:text-sm">
                      {selectedProduct.description}
                    </p>

                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
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
                              className={`h-9 w-12 rounded-xl text-xs font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
                                quickViewSize === size
                                  ? "bg-pink-600 border-pink-600 text-white"
                                  : "bg-white border-pink-100 text-gray-900 hover:border-pink-300"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mt-5">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
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
                              className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
                                quickViewColor === color
                                  ? "bg-pink-600 border-pink-600 text-white"
                                  : "bg-white border-pink-100 text-gray-900 hover:border-pink-300"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">Quantity</h4>
                      <div className="mt-2 inline-flex items-center gap-4 rounded-xl border border-pink-100 px-3 py-1.5">
                        <button
                          onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                          className="text-gray-900 transition active:scale-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center" aria-live="polite">
                          {quickViewQty}
                        </span>
                        <button
                          onClick={() => setQuickViewQty((q) => q + 1)}
                          className="text-gray-900 transition active:scale-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded"
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
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-bold uppercase tracking-wider py-4 transition duration-300 hover:shadow-lg active:scale-97 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
                    >
                      <ShoppingBag size={14} /> Add To Bag
                    </button>

                    <button
                      onClick={() => handleToggleWishlist(selectedProduct)}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-100 bg-white text-gray-900 transition hover:border-pink-400 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                      aria-label={
                        isInWishlist(String(selectedProduct.id))
                          ? `Remove ${selectedProduct.name} from wishlist`
                          : `Add ${selectedProduct.name} to wishlist`
                      }
                      aria-pressed={isInWishlist(String(selectedProduct.id))}
                    >
                      <Heart
                        size={18}
                        fill={isInWishlist(String(selectedProduct.id)) ? "#DB2777" : "none"}
                        stroke={isInWishlist(String(selectedProduct.id)) ? "#DB2777" : "#111827"}
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