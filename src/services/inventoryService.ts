import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

/**
 * Reduce product stock based on purchased items
 * Firestore structure:
 * stock: { "36": 10, "37": 20 }
 */

export const reduceInventory = async (items: any[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items provided for inventory update");
  }

  for (const item of items) {
    const productId = item?.id;

    if (!productId) {
      throw new Error("Item ID missing");
    }

    const size = String(item?.size || "");
    const qty = Number(item?.quantity || 1);

    if (!size) {
      throw new Error("Product size missing");
    }

    if (qty <= 0) {
      throw new Error("Invalid quantity");
    }

    const ref = doc(db, "products", productId);

    try {
      // 🔒 Use transaction to prevent race conditions
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);

        if (!snap.exists()) {
          console.error("Invalid product ID:", productId);
          throw new Error("Product not found");
        }

        const product = snap.data();
        const stock = product.stock || {};

        const currentStock = Number(stock[size] ?? 0);

        if (typeof stock[size] !== "number") {
          throw new Error(
            `${product.name || "Product"} size ${size} not available`
          );
        }

        if (currentStock < qty) {
          throw new Error(
            `${product.name || "Product"} out of stock (Size ${size})`
          );
        }

        const updatedStock = {
          ...stock,
          [size]: currentStock - qty,
        };

        transaction.update(ref, {
          stock: updatedStock,
          updatedAt: serverTimestamp(),
        });
      });
    } catch (error: any) {
      console.error("INVENTORY_ERROR:", {
        productId,
        size,
        qty,
        message: error.message,
      });

      throw error;
    }
  }
};