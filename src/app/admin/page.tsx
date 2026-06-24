"use client";

import { useEffect, useState } from "react";
import orderService from "@/services/orderService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

import AdminHeader from "@/components/admin/AdminHeader";
import DashboardCard from "@/components/admin/DashboardCard";

export default function AdminDashboard() {
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
      const productData = productSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productData);

      const userSnap = await getDocs(collection(db, "users"));
      const userData = userSnap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((u: any) => u.role === "user");

      setCustomers(userData);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (o) =>
      o.status === "Completed" ||
      o.status === "Delivered"
  ).length;

  const totalCustomers = customers.length;

  const lowStockProducts = products.filter((product: any) => {
    const stock = product.stock || {};
    let total = 0;

    Object.values(stock).forEach((sizeObj: any) => {
      Object.values(sizeObj || {}).forEach((qty: any) => {
        total += Number(qty || 0);
      });
    });

    return total <= 5;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Completed":
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] text-lg font-medium">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Dashboard"
        subtitle="Cinderella Shoe Store Admin Panel"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <DashboardCard
          title="Revenue"
          value={`LKR ${totalRevenue.toLocaleString()}`}
          valueClassName="text-pink-600"
        />
        <DashboardCard title="Orders" value={totalOrders} />
        <DashboardCard
          title="Pending"
          value={pendingOrders}
          valueClassName="text-yellow-600"
        />
        <DashboardCard
          title="Completed"
          value={completedOrders}
          valueClassName="text-green-600"
        />
        <DashboardCard
          title="Customers"
          value={totalCustomers}
          valueClassName="text-blue-600"
        />
        <DashboardCard
          title="Low Stock"
          value={lowStockProducts.length}
          valueClassName="text-red-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow p-6 border border-[#E8E8E8]">
        <h2 className="text-xl font-bold mb-4">⚠ Low Stock Products</h2>

        {lowStockProducts.length === 0 ? (
          <p className="text-green-600">
            All products are sufficiently stocked
          </p>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((product: any) => (
              <div
                key={product.id}
                className="flex justify-between border-b pb-2"
              >
                <span className="font-medium">
                  {product.name || "Unnamed Product"}
                </span>
                <span className="text-red-600 font-semibold">
                  Low Stock
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-6 border border-[#E8E8E8]">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>

        {orders.length === 0 ? (
          <p>No Orders Found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold text-gray-600">Order</th>
                  <th className="text-left py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-3 font-semibold text-gray-600">Total</th>
                  <th className="text-left py-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-semibold text-[#1C1C1E]">
                      {order.orderNumber || order.id}
                    </td>
                    <td className="py-3 text-gray-700">
                      {order.customerName ||
                        order.shippingAddress?.fullName ||
                        "Customer"}
                    </td>
                    <td className="py-3 text-pink-600 font-bold">
                      LKR {Number(order.total || 0).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
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