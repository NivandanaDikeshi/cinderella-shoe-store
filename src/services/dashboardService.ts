import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase/config";

const getDashboardStats = async () => {
  const productsSnapshot =
    await getDocs(
      collection(db, "products")
    );

  const customersSnapshot =
    await getDocs(
      collection(db, "customers")
    );

  const ordersSnapshot =
    await getDocs(
      collection(db, "orders")
    );

  let revenue = 0;

  ordersSnapshot.docs.forEach(
    (doc) => {
      const order = doc.data();

      revenue += Number(
        order.total || 0
      );
    }
  );

  const lowStockProducts =
    productsSnapshot.docs.filter(
      (doc) => {
        const product = doc.data();

        const totalStock =
          Object.values(
            product.inventory || {}
          ).reduce(
            (sum: number, stock: any) =>
              sum + Number(stock),
            0
          );

        return totalStock <= 3;
      }
    );

  return {
    products:
      productsSnapshot.size,

    customers:
      customersSnapshot.size,

    orders:
      ordersSnapshot.size,

    revenue,

    lowStock:
      lowStockProducts.length,
  };
};

const dashboardService = {
  getDashboardStats,
};

export default dashboardService;