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
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
}

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      toggleWishlist: (item) => {
        const exists = get().items.some((i) => i.id === item.id);

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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useWishlistStore;