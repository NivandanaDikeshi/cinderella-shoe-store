import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type WishlistStore = {
  items: WishlistItem[];

  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
};

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        const id = String(item.id);

        const exists = get().items.some((i) => i.id === id);

        if (!exists) {
          set((state) => ({
            items: [...state.items, { ...item, id }],
          }));
        }
      },

      removeFromWishlist: (id) => {
        const safeId = String(id);

        set((state) => ({
          items: state.items.filter((i) => i.id !== safeId),
        }));
      },

      isInWishlist: (id) => {
        const safeId = String(id);
        return get().items.some((i) => i.id === safeId);
      },

      toggleWishlist: (item) => {
        const id = String(item.id);

        const exists = get().items.some((i) => i.id === id);

        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, id }],
          }));
        }
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);

export default useWishlistStore;