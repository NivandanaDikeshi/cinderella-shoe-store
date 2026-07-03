"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;

  // Selected options
  size: string;
  color: string;

  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (
    id: string,
    size: string,
    color: string
  ) => void;

  updateCartItem: (
    id: string,
    size: string,
    color: string,
    updates: Partial<CartItem>
  ) => void;

  clearCart: () => void;

  getTotal: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.id === item.id &&
              i.size === item.size &&
              i.color === item.color
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id &&
                i.size === item.size &&
                i.color === item.color
                  ? {
                      ...i,
                      quantity: i.quantity + item.quantity,
                    }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      removeFromCart: (id, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.id === id &&
                item.size === size &&
                item.color === color
              )
          ),
        })),

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

      clearCart: () =>
        set({
          items: [],
        }),

      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;