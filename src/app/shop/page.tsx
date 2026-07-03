"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, ShoppingBag, Eye, Search, SlidersHorizontal, X } from "lucide-react";

import productService from "@/services/productService";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";

type Product = {
  id: string | number;
  name: string;
  price: number | string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[] | string;
  image?: string;
};

const CATEGORIES = ["Heels", "Flats", "Sandals", "Slippers"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) setCategory(urlCategory.toLowerCase());
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setLoading(true);
      const data = await productService.getProducts();
      if (!cancelled) {
        // ensure typed as Product[] to satisfy state setter
        setProducts((data as Product[]) || []);
        setLoading(false);
      }
    };
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const getImage = (product: Product) => {
    if (Array.isArray(product?.images) && product.images.length > 0)
      return product.images[0];
    if (typeof product?.images === "string") return product.images;
    if (product?.image) return product.image;
    return "/placeholder.jpg";
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: Number(product.price),
      image: getImage(product),
      size: product.sizes?.[0] || "",
      color: product.colors?.[0] || "",
      sizes: product.sizes || [],
      colors: product.colors || [],
      quantity: 1,
    });
    router.push("/cart");
  };

  const handleWishlist = (product: Product) => {
    toggleWishlist({
      id: String(product.id),
      name: product.name,
      price: Number(product.price),
      image: getImage(product),
    });
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        !category || p.category?.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "low") return Number(a.price) - Number(b.price);
      if (sort === "high") return Number(b.price) - Number(a.price);
      return 0;
    });
  }, [filtered, sort]);

  const activeFilterCount = (category ? 1 : 0) + (sort ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FFF7F5] font-body text-[#2C1A1F]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#F0DCDD]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16">
          <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C98A93] font-semibold mb-3">
            Homagama, Sri Lanka · Made to be worn
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-[#2C1A1F] max-w-2xl">
            The Collection
          </h1>
          <p className="mt-4 max-w-md text-sm sm:text-base text-[#8A6B70]">
            Pre-order your pair, pay on delivery. Every style below is
            available in limited stock, reserve yours before it's gone.
          </p>
        </div>
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#A83358]/5 blur-2xl" />
      </section>

      {/* Toolbar */}
      <div className="sticky top-0 z-20 bg-[#FFF7F5]/95 backdrop-blur border-b border-[#F0DCDD]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B99499]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search styles..."
                className="w-full rounded-full border border-[#F0DCDD] bg-white pl-10 pr-4 py-2.5 text-sm placeholder:text-[#B99499] focus:outline-none focus:ring-2 focus:ring-[#A83358]/20 focus:border-[#A83358]/40 transition"
              />
            </div>

            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-[#F0DCDD] bg-white px-4 py-2.5 text-sm font-medium shrink-0 hover:border-[#A83358]/40 transition"
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#A83358] text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Expandable filter row */}
          {filtersOpen && (
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory("")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition ${
                    !category
                      ? "bg-[#2C1A1F] text-white border-[#2C1A1F]"
                      : "bg-white text-[#8A6B70] border-[#F0DCDD] hover:border-[#2C1A1F]/30"
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c.toLowerCase())}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition ${
                      category === c.toLowerCase()
                        ? "bg-[#2C1A1F] text-white border-[#2C1A1F]"
                        : "bg-white text-[#8A6B70] border-[#F0DCDD] hover:border-[#2C1A1F]/30"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="ml-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-[#F0DCDD] bg-white px-3.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#A83358]/20"
                >
                  <option value="">Sort by</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setCategory("");
                    setSort("");
                  }}
                  className="flex items-center gap-1 text-xs text-[#C98A93] font-medium hover:underline"
                >
                  <X size={13} /> Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-14">
        {loading ? (
          <SkeletonGrid />
        ) : sorted.length === 0 ? (
          <EmptyState onReset={() => { setSearch(""); setCategory(""); setSort(""); }} />
        ) : (
          <>
            <p className="text-xs text-[#B99499] mb-6 tracking-wide uppercase">
              {sorted.length} {sorted.length === 1 ? "style" : "styles"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {sorted.map((product) => {
                const id = String(product.id);
                const liked = isInWishlist(id);

                return (
                  <article key={id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F5E3E1]">
                      <img
                        src={getImage(product)}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Wishlist */}
                      <button
                        onClick={() => handleWishlist(product)}
                        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm transition hover:scale-105"
                      >
                        <Heart
                          size={15}
                          fill={liked ? "#A83358" : "none"}
                          stroke={liked ? "#A83358" : "#2C1A1F"}
                        />
                      </button>

                      {/* Quick view - desktop hover overlay */}
                      <button
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center gap-2 rounded-full bg-[#2C1A1F]/90 backdrop-blur py-2.5 text-xs font-medium text-white opacity-0 translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <Eye size={14} /> Quick View
                      </button>
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-[#2C1A1F] truncate">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-[#A83358]">
                          LKR {Number(product.price).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        aria-label={`Add ${product.name} to bag`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F0DCDD] text-[#2C1A1F] transition hover:bg-[#2C1A1F] hover:text-white hover:border-[#2C1A1F]"
                      >
                        <ShoppingBag size={15} />
                      </button>
                    </div>

                    {/* Mobile-only view button */}
                    <button
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="sm:hidden mt-2 text-xs text-[#C98A93] font-medium"
                    >
                      View details
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-2xl bg-[#F5E3E1]" />
          <div className="mt-3 h-3 w-3/4 rounded bg-[#F5E3E1]" />
          <div className="mt-2 h-3 w-1/3 rounded bg-[#F5E3E1]" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5E3E1]">
        <Search size={20} className="text-[#B99499]" />
      </div>
      <h3 className="mt-5 font-display text-xl text-[#2C1A1F]">
        No styles match your search
      </h3>
      <p className="mt-1.5 text-sm text-[#9B7C80] max-w-xs">
        Try a different keyword or clear your filters to see the full
        collection.
      </p>
      <button
        onClick={onReset}
        className="mt-5 rounded-full bg-[#2C1A1F] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#2C1A1F]/90 transition"
      >
        Clear filters
      </button>
    </div>
  );
}