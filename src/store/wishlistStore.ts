"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  items: any[];

  addToWishlist: (
    product: any
  ) => void;

  removeFromWishlist: (
    id: string
  ) => void;

  toggleWishlist: (
    product: any
  ) => void;

  isInWishlist: (
    id: string
  ) => boolean;
}

const useWishlistStore =
  create<WishlistStore>()(
    persist(
      (set, get) => ({
        items: [],

        addToWishlist: (
          product
        ) => {
          const exists =
            get().items.find(
              (item) =>
                item.id ===
                product.id
            );

          if (exists) return;

          set({
            items: [
              ...get().items,
              product,
            ],
          });
        },

        removeFromWishlist: (
          id
        ) =>
          set({
            items:
              get().items.filter(
                (item) =>
                  item.id !== id
              ),
          }),

        toggleWishlist: (
          product
        ) => {
          const exists =
            get().items.find(
              (item) =>
                item.id ===
                product.id
            );

          if (exists) {
            set({
              items:
                get().items.filter(
                  (item) =>
                    item.id !==
                    product.id
                ),
            });
          } else {
            set({
              items: [
                ...get().items,
                product,
              ],
            });
          }
        },

        isInWishlist: (
          id
        ) =>
          get().items.some(
            (item) =>
              item.id === id
          ),
      }),
      {
        name: "wishlist-storage",
      }
    )
  );

export default useWishlistStore;