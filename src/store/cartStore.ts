"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) =>
        set((state) => {
          const exists = state.items.find(
            (i) =>
              i.id === item.id &&
              i.size === item.size &&
              i.color === item.color
          );

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === item.id &&
                i.size === item.size &&
                i.color === item.color
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeFromCart: (id, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.id === id &&
                i.size === size &&
                i.color === color
              )
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (t, i) => t + i.price * i.quantity,
          0
        ),
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;