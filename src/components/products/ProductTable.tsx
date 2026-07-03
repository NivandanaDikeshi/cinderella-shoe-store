"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit3, Trash2, Package2, Eye } from "lucide-react";

interface Product {
  id: string;
  name?: string;
  sku?: string;
  category?: string;
  price?: number;
  status?: string;
  stock?: Record<string, number>;
  inventory?: Record<string, number>;
  totalStock?: number;
  images?: string[] | string;
  image?: string;
}

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductTable({ products, onDelete }: Props) {
  const getProductImage = (product: Product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images[0];
    }

    if (typeof product?.images === "string" && product.images.trim()) {
      return product.images;
    }

    if (product?.image && product.image.trim()) {
      return product.image;
    }

    return "/placeholder.jpg";
  };

  const getTotalStock = (product: Product) => {
    if (typeof product.totalStock === "number") return product.totalStock;

    if (product.stock && typeof product.stock === "object") {
      return Object.values(product.stock).reduce(
        (sum, qty) => sum + Number(qty || 0),
        0
      );
    }

    if (product.inventory && typeof product.inventory === "object") {
      return Object.values(product.inventory).reduce(
        (sum, qty) => sum + Number(qty || 0),
        0
      );
    }

    return 0;
  };

  const getStatusClasses = (status?: string) => {
    if (status === "active") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    return "bg-rose-50 text-rose-700 border border-rose-200";
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <tr className="border-b border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => {
                const totalStock = getTotalStock(product);
                const productImage = getProductImage(product);

                return (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 transition hover:bg-gray-100/40"
                  >
                    {/* Product */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          <Image
                            src={productImage}
                            alt={product.name || "Product image"}
                            fill
                            sizes="72px"
                            className="object-cover"
                            unoptimized={productImage.startsWith("http")}
                          />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {product.name || "Untitled Product"}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            SKU: {product.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-600">
                        LKR {Number(product.price || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-900">
                          {totalStock} items
                        </span>

                        {totalStock <= 3 ? (
                          <span className="w-fit rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            In Stock
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClasses(
                          product.status
                        )}`}
                      >
                        {product.status || "inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye size={16} />
                          View
                        </Link>

                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <Edit3 size={16} />
                          Edit
                        </Link>

                        <button
                          onClick={() => onDelete(product.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                      <Package2 size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      No Products Found
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      There are no products available yet. Add your first product to
                      get started.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="grid gap-4 p-4 lg:hidden">
        {products.length > 0 ? (
          products.map((product) => {
            const totalStock = getTotalStock(product);
            const productImage = getProductImage(product);

            return (
              <div
                key={product.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <Image
                      src={productImage}
                      alt={product.name || "Product image"}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized={productImage.startsWith("http")}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                          {product.name || "Untitled Product"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          SKU: {product.sku || "N/A"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold capitalize ${getStatusClasses(
                          product.status
                        )}`}
                      >
                        {product.status || "inactive"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Category
                        </p>
                        <p className="mt-1 font-medium text-slate-800">
                          {product.category || "Uncategorized"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Price
                        </p>
                        <p className="mt-1 font-bold text-gray-600">
                          LKR {Number(product.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Stock
                        </p>
                        <p className="mt-1 font-medium text-slate-800">
                          {totalStock} items
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Availability
                        </p>
                        <p
                          className={`mt-1 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                            totalStock <= 3
                              ? "bg-rose-50 text-rose-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {totalStock <= 3 ? "Low Stock" : "In Stock"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={`/product/${product.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        <Edit3 size={16} />
                        Edit
                      </Link>

                      <button
                        onClick={() => onDelete(product.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
              <Package2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No Products Found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Add your first product to start managing inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}