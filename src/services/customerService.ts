import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type { Customer } from "@/types/customer";
import type { Order } from "@/types/order";

const getCustomers = async (): Promise<Customer[]> => {
  try {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Customer[];
  } catch (error) {
    console.error("GET_CUSTOMERS_ERROR:", error);
    return [];
  }
};

const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    if (!id) return null;

    const docRef = doc(db, "customers", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Customer;
  } catch (error) {
    console.error("GET_CUSTOMER_BY_ID_ERROR:", error);
    return null;
  }
};

const getCustomerByUid = async (uid: string): Promise<Customer | null> => {
  try {
    if (!uid) return null;

    const q = query(collection(db, "customers"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const firstDoc = snapshot.docs[0];

    return {
      id: firstDoc.id,
      ...firstDoc.data(),
    } as Customer;
  } catch (error) {
    console.error("GET_CUSTOMER_BY_UID_ERROR:", error);
    return null;
  }
};

const updateCustomerNotes = async (
  id: string,
  notes: string
): Promise<boolean> => {
  try {
    if (!id) throw new Error("Customer ID is required");

    const docRef = doc(db, "customers", id);

    await updateDoc(docRef, {
      notes,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("UPDATE_CUSTOMER_NOTES_ERROR:", error);
    return false;
  }
};

const upsertCustomerProfile = async (
  customer: Partial<Customer> & { id: string }
): Promise<boolean> => {
  try {
    const customerRef = doc(db, "customers", customer.id);

    await setDoc(
      customerRef,
      {
        ...customer,
        updatedAt: serverTimestamp(),
        createdAt: customer.createdAt || serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("UPSERT_CUSTOMER_PROFILE_ERROR:", error);
    return false;
  }
};

const upsertCustomerFromOrder = async (order: Partial<Order>): Promise<void> => {
  try {
    const customerEmail =
      order.customerEmail || (order as any)?.email || "";

    if (!customerEmail) return;

    // use email as doc id for easy uniqueness
    const customerRef = doc(db, "customers", customerEmail);
    const snapshot = await getDoc(customerRef);

    const orderTotal =
      Number(order.totalAmount || 0) ||
      Number((order as any)?.total || 0);

    const customerName =
      order.customerName || "Customer";

    const customerPhone =
      order.customerPhone || (order as any)?.phone || "";

    const userId =
      order.userId || "";

    if (!snapshot.exists()) {
      await setDoc(customerRef, {
        id: customerEmail,
        uid: userId,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        totalOrders: 1,
        totalSpent: orderTotal,
        notes: "",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const data = snapshot.data();

      await updateDoc(customerRef, {
        uid: data.uid || userId || "",
        name: customerName || data.name || "Customer",
        phone: customerPhone || data.phone || "",
        totalOrders: Number(data.totalOrders || 0) + 1,
        totalSpent: Number(data.totalSpent || 0) + orderTotal,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("UPSERT_CUSTOMER_FROM_ORDER_ERROR:", error);
  }
};

const customerService = {
  getCustomers,
  getCustomerById,
  getCustomerByUid,
  updateCustomerNotes,
  upsertCustomerProfile,
  upsertCustomerFromOrder,
};

export default customerService;