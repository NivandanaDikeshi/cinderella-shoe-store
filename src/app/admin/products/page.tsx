"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Pencil, Trash2, Package } from "lucide-react";

const PINK = "#EC4899";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  const getTotalStock = (stock: any) => {
    if (!stock) return 0;
    return Object.values(stock).reduce(
      (t: number, q: any) => t + Number(q || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-pink-50">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-pink-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="text-pink-500" />
              Products Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your store inventory in real-time
            </p>
          </div>

          <Link
            href="/admin/products/create"
            className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-black text-pink-500 hover:bg-pink-500 hover:text-white transition"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">

        {/* TABLE WRAPPER */}
        <div className="bg-white rounded-2xl shadow border border-pink-100 overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead className="bg-pink-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-5">Image</th>
                <th className="p-5">Product</th>
                <th className="p-5">Price</th>
                <th className="p-5">Stock</th>
                <th className="p-5">Total</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-pink-100">

              {products.map((product) => {
                const totalStock = getTotalStock(product.stock);

                return (
                  <tr key={product.id} className="hover:bg-pink-50 transition">

                    {/* IMAGE */}
                    <td className="p-5">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          className="w-12 h-12 rounded-lg object-cover border border-pink-100"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-pink-50 flex items-center justify-center text-xs rounded-lg">
                          No Image
                        </div>
                      )}
                    </td>

                    {/* PRODUCT */}
                    <td className="p-5">
                      <p className="font-bold text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        SKU: {product.sku || "-"}
                      </p>
                    </td>

                    {/* PRICE */}
                    <td className="p-5 font-bold text-slate-900">
                      LKR {product.price}
                    </td>

                    {/* STOCK */}
                    <td className="p-5 text-xs text-slate-600">
                      {product.stock ? (
                        Object.entries(product.stock).map(([size, qty]: any) => (
                          <div key={size}>
                            <span className="font-semibold text-pink-500">
                              Size {size}:
                            </span>{" "}
                            {qty}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400">No stock</span>
                      )}
                    </td>

                    {/* TOTAL STOCK */}
                    <td className="p-5 font-bold">
                      {totalStock}

                      {totalStock <= 5 && totalStock > 0 && (
                        <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                          Low
                        </span>
                      )}

                      {totalStock === 0 && (
                        <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                          Out
                        </span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-bold ${
                          product.status === "active"
                            ? "bg-pink-100 text-pink-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.status || "inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">

                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="p-2 rounded-lg border border-pink-200 hover:bg-pink-500 hover:text-white transition"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg border border-pink-200 hover:bg-pink-500 hover:text-white transition"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {products.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}