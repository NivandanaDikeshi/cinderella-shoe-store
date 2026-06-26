"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
}: {
  images: string[];
}) {
  const safeImages = useMemo(() => {
    if (Array.isArray(images) && images.length > 0) return images;
    return ["/placeholder.jpg"];
  }, [images]);

  const [selected, setSelected] = useState(safeImages[0]);

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={selected || "/placeholder.jpg"}
          alt="Product"
          width={800}
          height={800}
          className="h-[280px] w-full object-cover sm:h-[380px] md:h-[460px] lg:h-[520px]"
          priority
        />
      </div>

      {/* THUMBNAILS */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {safeImages.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelected(image)}
            className={`overflow-hidden rounded-xl border bg-white transition ${
              selected === image
                ? "border-pink-500 ring-2 ring-pink-200"
                : "border-gray-200 hover:border-pink-300"
            }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={120}
              height={120}
              className="h-20 w-full object-cover sm:h-24"
            />
          </button>
        ))}
      </div>
    </div>
  );
}