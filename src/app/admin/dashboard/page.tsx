"use client";

import { useEffect, useState } from "react";
import orderService from "@/services/orderService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardCard from "@/components/admin/DashboardCard";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import AccessDenied from "@/components/admin/AccessDenied";
import {
  ShoppingCart,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { roleCode, hasPermission } = useAdminAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const orderData = await orderService.getOrders();
      setOrders(orderData || []);

      const productSnap = await getDocs(collection(db, "products"));
      setProducts(
        productSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      const userSnap = await getDocs(collection(db, "users"));
      setCustomers(
        userSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u: any) => u.role === "user")
      );
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // METRICS
  // =========================
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === "Completed" || o.status === "Delivered"
  ).length;

  const totalCustomers = customers.length;

  const totalProducts = products.length;

  // STOCK CALCULATION (FIXED)
  const getProductStock = (product: any) => {
    const stock = product.stock || {};
    return Object.values(stock).reduce(
      (sum: number, qty: any) => sum + Number(qty || 0),
      0
    );
  };

  const lowStockProducts = products.filter(
    (p) => getProductStock(p) <= 5
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-6 py-6 space-y-10">
        <div className="text-gray-700 font-semibold text-lg animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const canView = roleCode === 0 || (typeof hasPermission === "function" && hasPermission("view dashboard"));
  if (!canView) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 px-6 py-6 space-y-10">

      {/* HEADER */}
      <AdminHeader
        title="Dashboard"
        subtitle="Cinderella Shoe Store Admin Panel"
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6">

        <DashboardCard
          title="Revenue"
          value={`LKR ${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="text-gray-500" />}
          valueClassName="text-gray-600 font-bold"
        />

        <DashboardCard
          title="Orders"
          value={totalOrders}
          icon={<ShoppingCart className="text-slate-600" />}
        />

        <DashboardCard
          title="Products"
          value={totalProducts}
          icon={<Package className="text-purple-500" />}
        />

        <DashboardCard
          title="Pending"
          value={pendingOrders}
          icon={<Clock className="text-yellow-500" />}
          valueClassName="text-yellow-600 font-semibold"
        />

        <DashboardCard
          title="Completed"
          value={completedOrders}
          icon={<CheckCircle2 className="text-green-500" />}
          valueClassName="text-green-600 font-semibold"
        />

        <DashboardCard
          title="Customers"
          value={totalCustomers}
          icon={<Users className="text-blue-500" />}
          valueClassName="text-blue-600 font-semibold"
        />
      </div>

      {/* LOW STOCK SECTION */}
      <div className="rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-lg p-6">

        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <AlertTriangle className="text-red-500" />
          Low Stock Products
        </h2>

        {lowStockProducts.length === 0 ? (
          <p className="text-green-600 font-medium">
            All products are well stocked ✨
          </p>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((product: any) => (
              <div
                key={product.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {product.name || "Unnamed Product"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stock: {getProductStock(product)} items
                  </p>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600">
                  Low Stock
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT ORDERS */}
      <div className="rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-lg p-6">

        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <ShoppingCart className="text-gray-500" />
          Recent Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No Orders Found</p>
        ) : (
          <div className="overflow-x-auto rounded-xl">

            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="text-left bg-gray-100 text-gray-600 text-sm">
                  <th className="py-3 px-3">Order</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 10).map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-200 hover:bg-gray-100/50 transition"
                  >
                    <td className="py-4 px-3 font-semibold">
                      {order.orderNumber || order.id}
                    </td>

                    <td className="py-4 px-3 text-gray-700">
                      {order.customerName ||
                        order.shippingAddress?.fullName ||
                        "Customer"}
                    </td>

                    <td className="py-4 px-3 font-bold text-green-600">
                      LKR {Number(order.total || 0).toLocaleString()}
                    </td>

                    <td className="py-4 px-3">
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

    </div>
  );
}