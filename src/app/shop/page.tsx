"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, ShoppingBag, Eye, Search, SlidersHorizontal, X } from "lucide-react";

import { getProducts } from "@/services/productService";
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

function ShopPageInner() {
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
      const data = await getProducts();
      if (!cancelled) {
        setProducts((data as Product[]) || []);
        setLoading(false);
      }
    };
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  // lock body scroll when the mobile filter sheet is open
  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

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
    <div
      className="min-h-screen font-body text-[#2B1620]"
      style={{
        background:
          "linear-gradient(135deg, #FADCE9 0%, #FCE9F0 35%, #FDF3F6 65%, #FFFFFF 100%)",
      }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#F2DEE0]/70">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-16">
          <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#B33B5E] font-semibold mb-3">
            Homagama, Sri Lanka · Made to be worn
          </p>
          <h1 className="font-display font-black tracking-tight text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl text-[#211016] max-w-3xl">
            The Collection
          </h1>
          <div className="mt-5 h-[3px] w-16 rounded-full bg-[#B33B5E]" />
          <p className="mt-5 max-w-md text-sm sm:text-base text-[#8C6169] leading-relaxed">
            Pre-order your pair, pay on delivery. Every style below is
            available in limited stock, reserve yours before it's gone.
          </p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/40 blur-3xl"
        />
      </section>

      {/* Toolbar */}
      <div className="sticky top-0 z-20 bg-[#FDF0F5]/80 backdrop-blur-md border-b border-[#F2DEE0]/70">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-3.5 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C79399]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search styles..."
                className="w-full rounded-full border border-[#F2DEE0] bg-white pl-10 pr-4 py-2.5 text-sm placeholder:text-[#C79399] focus:outline-none focus:ring-2 focus:ring-[#B33B5E]/15 focus:border-[#B33B5E]/40 transition"
              />
            </div>

            <button
              onClick={() => setFiltersOpen(true)}
              className="relative flex h-[42px] items-center gap-2 rounded-full border border-[#F2DEE0] bg-white px-4 text-sm font-medium shrink-0 active:scale-[0.97] hover:border-[#B33B5E]/40 transition"
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B33B5E] text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {category && (
                <span className="flex items-center gap-1.5 rounded-full bg-[#2B1620] px-3 py-1 text-[11px] font-medium text-white">
                  {category[0].toUpperCase() + category.slice(1)}
                  <button onClick={() => setCategory("")} aria-label="Remove category filter">
                    <X size={11} />
                  </button>
                </span>
              )}
              {sort && (
                <span className="flex items-center gap-1.5 rounded-full bg-[#2B1620] px-3 py-1 text-[11px] font-medium text-white">
                  {sort === "low" ? "Price: Low to High" : "Price: High to Low"}
                  <button onClick={() => setSort("")} aria-label="Remove sort filter">
                    <X size={11} />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setCategory("");
                  setSort("");
                }}
                className="text-[11px] text-[#B33B5E] font-semibold hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter sheet (mobile: bottom sheet · desktop: centered modal) */}
      {filtersOpen && (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-[#2B1620]/40 backdrop-blur-[2px]"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl px-5 pt-3 pb-6 sm:p-7 shadow-2xl animate-[slideUp_0.25s_ease-out]">
            <div className="sm:hidden mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#F2DEE0]" />

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-extrabold text-xl text-[#211016]">
                Filters
              </h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF0F5] hover:bg-[#F2DEE0] transition"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#C79399] mb-2.5">
              Category
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible scrollbar-hide">
              <button
                onClick={() => setCategory("")}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition ${
                  !category
                    ? "bg-[#2B1620] text-white border-[#2B1620]"
                    : "bg-white text-[#8C6169] border-[#F2DEE0]"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c.toLowerCase())}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition ${
                    category === c.toLowerCase()
                      ? "bg-[#2B1620] text-white border-[#2B1620]"
                      : "bg-white text-[#8C6169] border-[#F2DEE0]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#C79399] mt-6 mb-2.5">
              Sort by
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Featured", value: "" },
                { label: "Price: Low to High", value: "low" },
                { label: "Price: High to Low", value: "high" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSort(opt.value)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    sort === opt.value
                      ? "border-[#B33B5E] bg-[#B33B5E]/5 text-[#B33B5E]"
                      : "border-[#F2DEE0] text-[#2B1620]"
                  }`}
                >
                  {opt.label}
                  {sort === opt.value && (
                    <span className="h-2 w-2 rounded-full bg-[#B33B5E]" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setCategory("");
                  setSort("");
                }}
                className="flex-1 rounded-full border border-[#F2DEE0] py-3 text-sm font-medium text-[#8C6169]"
              >
                Reset
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex-1 rounded-full bg-[#B33B5E] py-3 text-sm font-semibold text-white active:scale-[0.98] transition"
              >
                Show {sorted.length} {sorted.length === 1 ? "style" : "styles"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8 sm:py-14">
        {loading ? (
          <SkeletonGrid />
        ) : sorted.length === 0 ? (
          <EmptyState onReset={() => { setSearch(""); setCategory(""); setSort(""); }} />
        ) : (
          <>
            <p className="text-xs text-[#C79399] mb-5 sm:mb-6 tracking-wide uppercase font-medium">
              {sorted.length} {sorted.length === 1 ? "style" : "styles"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-7 sm:gap-x-6 sm:gap-y-10">
              {sorted.map((product) => {
                const id = String(product.id);
                const liked = isInWishlist(id);

                return (
                  <article key={id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F5E3E1] shadow-sm ring-1 ring-[#F2DEE0]">
                      <img
                        src={getImage(product)}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Wishlist */}
                      <button
                        onClick={() => handleWishlist(product)}
                        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur shadow-sm transition active:scale-90"
                      >
                        <Heart
                          size={14}
                          fill={liked ? "#df2d60" : "none"}
                          stroke={liked ? "#ea4b78" : "#2B1620"}
                        />
                      </button>

                      {/* View Product- desktop hover overlay */}
                      <button
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center gap-2 rounded-full bg-[#2B1620]/90 backdrop-blur py-2.5 text-xs font-medium text-white opacity-0 translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                      >
                        <Eye size={14} /> View Product
                      </button>
                    </div>

                    <div className="mt-2.5 sm:mt-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[13px] sm:text-sm font-medium text-[#2B1620] truncate">
                          {product.name}
                        </h3>
                        <p className="mt-0.5 sm:mt-1 text-[13px] sm:text-sm font-semibold text-[#B33B5E]">
                          LKR {Number(product.price).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        aria-label={`Add ${product.name} to bag`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F2DEE0] text-[#2B1620] transition active:scale-90 hover:bg-[#2B1620] hover:text-white hover:border-[#2B1620]"
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>

                    {/* Mobile-only view button */}
                    <button
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="sm:hidden mt-1.5 text-[11px] text-[#B33B5E] font-semibold"
                    >
                      View details →
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(24px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-7 sm:gap-x-6 sm:gap-y-10">
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
    <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5E3E1]">
        <Search size={20} className="text-[#C79399]" />
      </div>
      <h3 className="mt-5 font-display font-extrabold text-lg sm:text-xl text-[#211016]">
        No styles match your search
      </h3>
      <p className="mt-1.5 text-sm text-[#8C6169] max-w-xs">
        Try a different keyword or clear your filters to see the full
        collection.
      </p>
      <button
        onClick={onReset}
        className="mt-5 rounded-full bg-[#2B1620] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#B33B5E] transition"
      >
        Clear filters
      </button>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <ShopPageInner />
    </Suspense>
  );
}