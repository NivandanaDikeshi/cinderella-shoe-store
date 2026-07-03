"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

/* =========================
   CATEGORY MODAL (MODERN)
========================= */
function CategoryModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    if (!name.trim()) return alert("Please enter category name");

    try {
      setLoading(true);

      await addDoc(collection(db, "categories"), {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        status: "active",
        displayOrder: 1,
        createdAt: new Date(),
      });

      setName("");
      onClose();
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl p-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Add Category
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-5">
          Create a new product category
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>

        </div>
      </div>
    </div>
  );
}

/* =========================
   PAGE
========================= */
export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "categories"));

      setCategories(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Categories
          </h1>
          <p className="text-gray-500 mt-1">
            Manage product categories efficiently
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition"
        >
          + Add Category
        </button>

      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

        {loading ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No categories found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">

            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition bg-white"
              >

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {cat.slug}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                  {cat.status}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* MODAL */}
      <CategoryModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={loadCategories}
      />

    </div>
  );
}