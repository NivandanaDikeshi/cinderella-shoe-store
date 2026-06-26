"use client";

import { useEffect, useState } from "react";
import { Plus, Heart, Minus, ShoppingCart } from "lucide-react";

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

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const getImage = (product: any) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images[0];
    }

    if (typeof product?.images === "string") {
      return product.images;
    }

    if (product?.image) {
      return product.image;
    }

    return "/placeholder.jpg";
  };

  const handleAddToCart = (product: any) => {
    const size = selectedSizes[product.id];
    const color = selectedColors[product.id] || "";
    const quantity = quantities[product.id] || 1;

    if (!size) {
      alert("Please select a size first");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: getImage(product),
      size,
      color,
      quantity,
    });
  };

  const updateQty = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, value),
    }));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !category || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts];

  if (sort === "low") {
    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "high") {
    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* HEADER */}
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 sm:pt-10 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
          Shop Shoes 👠
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
          Discover premium shoes designed for comfort, elegance, and everyday
          style.
        </p>
      </div>

      {/* FILTERS */}
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="w-full">
            <ProductSearch search={search} setSearch={setSearch} />
          </div>

          <div className="w-full">
            <ProductFilters category={category} setCategory={setCategory} />
          </div>

          <div className="w-full">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-400"
            >
              <option value="">Sort Products</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => {
              const sizes = Array.isArray(product.sizes) ? product.sizes : [];
              const colors = Array.isArray(product.colors) ? product.colors : [];
              const imageUrl = getImage(product);

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* IMAGE */}
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-60 w-full object-cover sm:h-64"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm transition ${
                        isInWishlist(product.id)
                          ? "text-red-500"
                          : "text-gray-600 hover:text-pink-600"
                      }`}
                      aria-label="Toggle wishlist"
                    >
                      <Heart
                        size={18}
                        fill={isInWishlist(product.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 sm:p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>

                    <div className="mt-2">
                      <ProductRating productId={product.id} />
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.category}
                    </p>

                    <p className="mt-2 text-xl font-bold text-pink-600">
                      LKR {Number(product.price).toLocaleString()}
                    </p>

                    {/* SIZE */}
                    <select
                      className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-pink-400"
                      value={selectedSizes[product.id] || ""}
                      onChange={(e) =>
                        setSelectedSizes({
                          ...selectedSizes,
                          [product.id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Size</option>
                      {sizes.length > 0 ? (
                        sizes.map((s: string) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))
                      ) : (
                        <option disabled>No sizes</option>
                      )}
                    </select>

                    {/* COLOR */}
                    <select
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-pink-400"
                      value={selectedColors[product.id] || ""}
                      onChange={(e) =>
                        setSelectedColors({
                          ...selectedColors,
                          [product.id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Color</option>
                      {colors.length > 0 ? (
                        colors.map((c: string) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))
                      ) : (
                        <option disabled>No colors</option>
                      )}
                    </select>

                    {/* QTY */}
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5">
                      <button
                        onClick={() =>
                          updateQty(product.id, (quantities[product.id] || 1) - 1)
                        }
                        className="rounded-md p-1 text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="text-sm font-semibold text-gray-800">
                        {quantities[product.id] || 1}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(product.id, (quantities[product.id] || 1) + 1)
                        }
                        className="rounded-md p-1 text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* ADD TO CART */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                    >
                      <ShoppingCart size={17} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl bg-white/70 py-20 text-center text-gray-500 shadow-sm">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}