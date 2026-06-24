"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
}: {
  images: string[];
}) {
  const [selected, setSelected] =
    useState(
      images?.[0] || ""
    );

  return (
    <div>
      <Image
        src={selected}
        alt="Product"
        width={600}
        height={600}
        className="w-full rounded-xl object-cover"
      />

      <div className="grid grid-cols-4 gap-2 mt-4">
        {images?.map(
          (image, index) => (
            <Image
              key={index}
              src={image}
              alt=""
              width={100}
              height={100}
              onClick={() =>
                setSelected(
                  image
                )
              }
              className="cursor-pointer rounded border"
            />
          )
        )}
      </div>
    </div>
  );
}