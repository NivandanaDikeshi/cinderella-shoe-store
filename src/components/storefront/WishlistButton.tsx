"use client";

import useWishlistStore from "@/store/wishlistStore";

interface Props {
  product: any;
}

export default function WishlistButton({
  product,
}: Props) {
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const added =
    isInWishlist(product.id);

  const handleWishlist = () => {
    if (added) {
      removeFromWishlist(
        product.id
      );
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      onClick={handleWishlist}
      className={`px-6 py-3 rounded-lg text-white ${
        added
          ? "bg-red-500"
          : "bg-pink-600"
      }`}
    >
      {added
        ? "♥ Remove Wishlist"
        : "♡ Add To Wishlist"}
    </button>
  );
}