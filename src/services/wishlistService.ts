import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
}

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (item) => {
        const exists = get().items.find((i) => i.id === item.id);

        if (exists) {
          set({
            items: get().items.filter((i) => i.id !== item.id),
          });
        } else {
          set({
            items: [...get().items, item],
          });
        }
      },

      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },

      removeFromWishlist: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);

export default useWishlistStore;