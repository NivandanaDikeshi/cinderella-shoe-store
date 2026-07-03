"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import productService from "@/services/productService";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [colorInput, setColorInput] = useState("");

  const [product, setProduct] = useState<any>({
    name: "",
    sku: "",
    category: "",
    price: 0,
    discountPrice: 0,
    description: "",
    featured: false,
    status: "active",
    stock: {},
    colors: [],
  });

  const sizes = ["36", "37", "38", "39", "40", "41"];

  // =========================
  // LOAD PRODUCT
  // =========================
  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data: any = await productService.getProductById(id);

      if (!data) {
        alert("Product not found");
        router.push("/admin/products");
        return;
      }

      setProduct({
        ...data,
        stock: data?.stock || {},
        colors: data?.colors || [],
      });
    } catch (error) {
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STOCK UPDATE
  // =========================
  const updateStock = (size: string, value: number) => {
    setProduct((prev: any) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: Math.max(0, value || 0),
      },
    }));
  };

  // =========================
  // COLORS
  // =========================
  const addColor = () => {
    if (!colorInput.trim()) return;

    setProduct((prev: any) => ({
      ...prev,
      colors: [...(prev.colors || []), colorInput.trim()],
    }));

    setColorInput("");
  };

  const removeColor = (color: string) => {
    setProduct((prev: any) => ({
      ...prev,
      colors: prev.colors.filter((c: string) => c !== color),
    }));
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const productRef = doc(db, "products", id);
      await updateDoc(productRef, product);

      alert("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-semibold">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Edit Product
              </h1>
              <p className="text-sm text-slate-500">
                Update product details, stock, and colors
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-bold">
            ID: {id.slice(0, 6)}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6">

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >

          {/* LEFT */}
          <div className="space-y-6">

            {/* BASIC INFO */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
              <h2 className="font-bold text-lg mb-4">Basic Information</h2>

              <div className="grid gap-4">

                <input
                  className="border p-3 rounded-xl"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                />

                <input
                  className="border p-3 rounded-xl"
                  placeholder="SKU"
                  value={product.sku}
                  onChange={(e) =>
                    setProduct({ ...product, sku: e.target.value })
                  }
                />

                <input
                  className="border p-3 rounded-xl"
                  placeholder="Category"
                  value={product.category}
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                />

                <input
                  type="number"
                  className="border p-3 rounded-xl"
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: Number(e.target.value) })
                  }
                />

                <textarea
                  className="border p-3 rounded-xl"
                  rows={4}
                  placeholder="Description"
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                />

              </div>
            </div>

            {/* COLORS */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
              <h2 className="font-bold text-lg mb-4">Colors</h2>

              <div className="flex gap-2">
                <input
                  className="border p-2 rounded-xl w-full"
                  placeholder="Add color"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                />

                <button
                  type="button"
                  onClick={addColor}
                  className="bg-black text-white px-4 rounded-xl"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {(product.colors || []).map((color: string) => (
                  <span
                    key={color}
                    onClick={() => removeColor(color)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full cursor-pointer text-sm"
                  >
                    {color} ✕
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* STOCK */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
              <h2 className="font-bold text-lg mb-4">Size Stock</h2>

              <div className="grid grid-cols-3 gap-3">
                {sizes.map((size) => (
                  <div key={size} className="border rounded-xl p-3">
                    <p className="text-center font-bold">{size}</p>

                    <input
                      type="number"
                      className="w-full border mt-2 p-2 rounded-lg"
                      value={product.stock?.[size] || ""}
                      onChange={(e) =>
                        updateStock(size, Number(e.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex items-center gap-3">
              <input
                type="checkbox"
                checked={product.featured}
                onChange={() =>
                  setProduct({
                    ...product,
                    featured: !product.featured,
                  })
                }
              />
              <label className="font-medium">Featured Product</label>
            </div>

            {/* SAVE */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gray-600 text-white py-4 rounded-2xl font-bold hover:bg-gray-700 transition flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}