"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";

export default function ProductClient({ product }: any) {
  const router = useRouter();

  // ✅ IMPORTANT: must match your store
  const { addToCart } = useCartStore();

  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const stock = product.stock || {};

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "/placeholder.jpg"];

  const availableSizes = sizes.filter(
    (s: string) => (stock?.[s] ?? 0) > 0
  );

  const [selectedSize, setSelectedSize] = useState(
    availableSizes[0] || sizes[0] || ""
  );

  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const [toast, setToast] = useState("");

  // ✅ ADD TO CART FIXED
  const handleAddToCart = () => {
    if (!selectedSize) {
      setToast("Please select a size");
      return;
    }

    if (!selectedColor) {
      setToast("Please select a color");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: selectedImage,

      size: selectedSize,
      color: selectedColor,
      quantity: 1,

      // ✅ REQUIRED for CartItem type
      sizes,
      colors,
    });

    setToast("Added to cart ✅");

    setTimeout(() => {
      setToast("");
      router.push("/cart");
    }, 800);
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">

      {/* IMAGE */}
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <img
            src={selectedImage}
            className="w-full h-[450px] object-cover"
          />
        </div>

        <div className="flex gap-2">
          {images.map((img: string) => (
            <img
              key={img}
              src={img}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                selectedImage === img
                  ? "border-black"
                  : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* DETAILS */}
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-2xl font-bold text-pink-600">
          LKR {product.price}
        </p>

        {/* SIZE */}
        <div>
          <h2 className="font-semibold mb-2">Select Size</h2>

          <div className="flex gap-2 flex-wrap">
            {availableSizes.length > 0 ? (
              availableSizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg transition ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))
            ) : (
              <p className="text-sm text-red-500">
                No sizes available
              </p>
            )}
          </div>
        </div>

        {/* COLOR */}
        <div>
          <h2 className="font-semibold mb-2">Select Color</h2>

          <div className="flex gap-3">
            {colors.length > 0 ? (
              colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  className={`w-10 h-10 rounded-full border-2 transition ${
                    selectedColor === color
                      ? "border-black scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))
            ) : (
              <p className="text-sm text-red-500">
                No colors available
              </p>
            )}
          </div>
        </div>

        {/* STOCK */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Stock</p>
          <p className="font-bold">
            {stock?.[selectedSize] ?? 0} available
          </p>
        </div>

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}