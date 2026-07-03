"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";

export default function ProductClient({ product }: any) {
  const router = useRouter();

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

  const handleAddToCart = () => {
    if (!selectedSize) return setToast("Select size");
    if (!selectedColor) return setToast("Select color");

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: selectedImage,

      size: selectedSize,
      color: selectedColor,
      quantity: 1,

      // ✅ REQUIRED (fixes ALL TS errors)
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
    <div>
      {/* YOUR UI REMAINS SAME */}
      <button onClick={handleAddToCart}>
        Add to Cart
      </button>

      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-xl">
          {toast}
        </div>
      )}
    </div>
  );
}