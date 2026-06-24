"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
  product,
}: any) {
  return (
    <Link
      href={`/product/${product.id}`}
    >
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition">

        <Image
          src={product.images?.[0]}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-72 object-cover rounded-t-xl"
        />

        <div className="p-4">
          <h3 className="font-semibold">
            {product.name}
          </h3>

          <p className="text-pink-600 font-bold">
            LKR {product.price}
          </p>
        </div>

      </div>
    </Link>
  );
}