import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;

  size: string;
  color: string;

  sizes: string[];
  colors: string[];

  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string, color: string) => void;

  updateCartItem: (
    id: string,
    size: string,
    color: string,
    updates: Partial<CartItem>
  ) => void;

  getTotal: () => number;
  clearCart: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // ADD TO CART (merge same variant)
      addToCart: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.id === item.id &&
              i.size === item.size &&
              i.color === item.color
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id &&
                i.size === item.size &&
                i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      // REMOVE ITEM
      removeFromCart: (id, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          ),
        })),

      // UPDATE ITEM
      updateCartItem: (id, size, color, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id &&
            item.size === size &&
            item.color === color
              ? { ...item, ...updates }
              : item
          ),
        })),

      // TOTAL
      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      // CLEAR CART
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;