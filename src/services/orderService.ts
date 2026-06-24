import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

const VALID_STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Dispatched",
  "Completed",
  "Cancelled",
];

const VALID_PAYMENT_STATUSES: PaymentStatus[] = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
];

const getOrders = async (status?: OrderStatus): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, "orders");

    const q = status
      ? query(
          ordersRef,
          where("status", "==", status),
          orderBy("createdAt", "desc")
        )
      : query(ordersRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Order[];
  } catch (error) {
    console.error("GET_ORDERS_ERROR:", error);
    return [];
  }
};

const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    if (!userId) return [];

    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Order[];
  } catch (error) {
    console.error("GET_ORDERS_BY_USER_ID_ERROR:", error);
    return [];
  }
};

const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    if (!id) return null;

    const ref = doc(db, "orders", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Order;
  } catch (error) {
    console.error("GET_ORDER_BY_ID_ERROR:", error);
    return null;
  }
};

const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const payload: Omit<Order, "id"> = {
      ...orderData,
      orderNumber:
        orderData.orderNumber ||
        `ORD-${Date.now()}`,
      status: orderData.status || "Pending",
      paymentStatus:
        orderData.paymentStatus || "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "orders"),
      payload
    );

    return docRef.id;
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);
    return null;
  }
};

const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<boolean> => {
  try {
    if (!id) throw new Error("Order ID is required");

    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`Invalid order status: ${status}`);
    }

    const ref = doc(db, "orders", id);

    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("UPDATE_ORDER_STATUS_ERROR:", error);
    return false;
  }
};

const updatePaymentStatus = async (
  id: string,
  paymentStatus: PaymentStatus
): Promise<boolean> => {
  try {
    if (!id) throw new Error("Order ID is required");

    if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
      throw new Error(`Invalid payment status: ${paymentStatus}`);
    }

    const ref = doc(db, "orders", id);

    await updateDoc(ref, {
      paymentStatus,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("UPDATE_PAYMENT_STATUS_ERROR:", error);
    return false;
  }
};

const updateOrder = async (
  id: string,
  data: Partial<Order>
): Promise<boolean> => {
  try {
    if (!id) throw new Error("Order ID is required");

    const ref = doc(db, "orders", id);

    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("UPDATE_ORDER_ERROR:", error);
    return false;
  }
};


const markAsCompleted = async (id: string): Promise<boolean> => {
  return updateOrderStatus(id, "Completed");
};

const markAsDispatched = async (id: string): Promise<boolean> => {
  return updateOrderStatus(id, "Dispatched");
};

const cancelOrder = async (id: string): Promise<boolean> => {
  return updateOrderStatus(id, "Cancelled");
};

const orderService = {
  getOrders,
  getOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
  markAsCompleted,
  markAsDispatched,
  cancelOrder,
};

export default orderService;