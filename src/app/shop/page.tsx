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

  // ✅ SAFE IMAGE FIX (VERY IMPORTANT)
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
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Shop Shoes 👠
        </h1>
        <p className="text-gray-500 mt-2">
          Discover premium shoes designed for comfort & style
        </p>
      </div>

      {/* FILTER */}
      <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col md:flex-row gap-4">

        <ProductSearch search={search} setSearch={setSearch} />

        <ProductFilters category={category} setCategory={setCategory} />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">Sort</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 pb-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => {
              const sizes = Array.isArray(product.sizes) ? product.sizes : [];
              const colors = Array.isArray(product.colors) ? product.colors : [];

              const imageUrl = getImage(product);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
                >

                  {/* IMAGE */}
                  <div className="relative">

                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-3 right-3 p-2 bg-white rounded-full ${
                        isInWishlist(product.id)
                          ? "text-red-500"
                          : "text-gray-600"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={
                          isInWishlist(product.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    <h3 className="font-bold text-lg">{product.name}</h3>

                    <ProductRating productId={product.id} />

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>

                    <p className="text-pink-600 font-bold text-xl mt-2">
                      LKR {Number(product.price).toLocaleString()}
                    </p>

                    {/* SIZE */}
                    <select
                      className="w-full border p-2 rounded mt-3"
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
                      className="w-full border p-2 rounded mt-2"
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
                    <div className="flex justify-between items-center mt-3 border p-2 rounded">

                      <button
                        onClick={() =>
                          updateQty(product.id, (quantities[product.id] || 1) - 1)
                        }
                      >
                        <Minus size={16} />
                      </button>

                      <span>{quantities[product.id] || 1}</span>

                      <button
                        onClick={() =>
                          updateQty(product.id, (quantities[product.id] || 1) + 1)
                        }
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                    {/* ADD */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-4 bg-pink-600 text-white py-2 rounded"
                    >
                      <ShoppingCart size={16} className="inline mr-2" />
                      Add to Cart
                    </button>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No products found
            </div>
          )}

        </div>
      </div>
    </div>
  );
}