"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye } from "lucide-react";

import productService from "@/services/productService";
import ProductSearch from "@/components/storefront/ProductSearch";
import ProductFilters from "@/components/storefront/ProductFilters";
import ProductRating from "@/components/storefront/ProductRating";

import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const router = useRouter();

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // CATEGORY FROM URL (SAFE)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlCategory = new URLSearchParams(window.location.search).get("category");

    if (urlCategory) {
      setCategory(urlCategory.toLowerCase());
    }
  }, []);

  // LOAD PRODUCTS
  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      }
    };

    load();
  }, []);

  // IMAGE HANDLER
  const getImage = (product: any) => {
    if (!product) return "/placeholder.jpg";

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    if (typeof product.images === "string") {
      return product.images;
    }

    return product.image || "/placeholder.jpg";
  };

  // ADD TO CART (SAFE)
  const handleAddToCart = (product: any) => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name || "Unknown Product",
      price: Number(product.price) || 0,
      image: getImage(product),

      size: product.sizes?.[0] || "",
      color: product.colors?.[0] || "",

      quantity: 1,
    });

    router.push("/cart");
  };

  // FILTER (SAFE)
  const filtered = products.filter((p) => {
    const name = p?.name?.toLowerCase() || "";
    const matchSearch = name.includes(search.toLowerCase());

    const matchCategory =
      !category || (p?.category || "").toLowerCase() === category.toLowerCase();

    return matchSearch && matchCategory;
  });

  // SORT
  const sorted = [...filtered].sort((a, b) => {
    const priceA = Number(a?.price) || 0;
    const priceB = Number(b?.price) || 0;

    if (sort === "low") return priceA - priceB;
    if (sort === "high") return priceB - priceA;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">

      {/* HEADER */}
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Discover Premium Shoes 👠
        </h1>

        <p className="mt-2 text-gray-500 text-lg">
          Elegant designs crafted for comfort, confidence & modern lifestyle.
        </p>

        {category && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1 text-sm font-semibold text-pink-600">
            Showing: {category.toUpperCase()}
          </div>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="mx-auto max-w-7xl px-4 mb-10">
        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white shadow-sm p-2">
            <ProductSearch search={search} setSearch={setSearch} />
          </div>

          <div className="rounded-2xl bg-white shadow-sm p-2">
            <ProductFilters category={category} setCategory={setCategory} />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-2xl bg-white px-4 py-3 text-sm border border-gray-100 focus:border-pink-400 outline-none"
          >
            <option value="">Sort Products</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>

        </div>
      </div>

      {/* PRODUCTS */}
      <div className="mx-auto max-w-7xl px-4 pb-20">

        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {sorted.map((product) => {
              const imageUrl = getImage(product);

              return (
                <div
                  key={product?.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >

                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      className="h-72 w-full object-cover group-hover:scale-110 transition duration-700"
                    />

                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:scale-110 transition"
                    >
                      <Heart
                        size={18}
                        fill={isInWishlist(product?.id) ? "#ef4444" : "none"}
                      />
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product?.name}
                    </h3>

                    <div className="mt-1">
                      <ProductRating productId={product?.id} />
                    </div>

                    <p className="mt-2 text-xl font-bold text-pink-600">
                      LKR {Number(product?.price || 0).toLocaleString()}
                    </p>

                    {/* ACTIONS */}
                    <div className="mt-4 flex gap-2">

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>

                      <button
                        onClick={() => router.push(`/product/${product?.id}`)}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                      >
                        <Eye size={18} />
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}