"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  Plus,
  Upload,
  X,
  Tag,
  Palette,
  Package,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { db } from "@/lib/firebase/config";

type Category = {
  id: string;
  name: string;
  slug?: string;
};

type StockMap = Record<string, number>;
type ProductStatus = "active" | "inactive";

const SHOE_SIZES = ["36", "37", "38", "39", "40", "41"];

export default function ProductForm() {
  const [loading, setLoading] = useState(false);

  // FORM
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    description: "",
    status: "active" as ProductStatus,
  });

  // CATEGORY
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // STOCK + COLORS
  const [stock, setStock] = useState<StockMap>({});
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  // IMAGES
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // =========================
  // LOAD CATEGORIES
  // =========================
  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Category, "id">),
      }));
      setCategories(list);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  // =========================
  // HELPERS
  // =========================
  const totalStock = useMemo(
    () => Object.values(stock).reduce((a, b) => a + Number(b || 0), 0),
    [stock]
  );

  const slugify = (v: string) =>
    v.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const generateSKU = () => {
    const sku = `SHO-${Math.floor(1000 + Math.random() * 9000)}`;
    setForm((p) => ({ ...p, sku }));
  };

  // =========================
  // CATEGORY ADD
  // =========================
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    setAddingCategory(true);
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        slug: slugify(newCategory),
        createdAt: serverTimestamp(),
      });
      setNewCategory("");
    } finally {
      setAddingCategory(false);
    }
  };

  // =========================
  // STOCK
  // =========================
  const updateStock = (size: string, value: number) => {
    setStock((p) => ({ ...p, [size]: Math.max(0, value || 0) }));
  };

  // =========================
  // COLORS
  // =========================
  const addColor = () => {
    if (!colorInput.trim()) return;
    setColors((p) => [...p, colorInput]);
    setColorInput("");
  };

  const removeColor = (c: string) => {
    setColors((p) => p.filter((x) => x !== c));
  };

  // =========================
  // IMAGES
  // =========================
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const arr = Array.from(e.target.files);
    setFiles((p) => [...p, ...arr]);
    setPreviews((p) => [
      ...p,
      ...arr.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  // =========================
  // CLOUDINARY
  // =========================
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cinderella_store");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/daeitip2j/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price || files.length === 0) {
      alert("Fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const uploaded = await Promise.all(files.map(uploadImage));

      await addDoc(collection(db, "products"), {
        name: form.name,
        sku: form.sku || `SHO-${Date.now()}`,
        slug: slugify(form.name),
        category: form.category,
        price: Number(form.price),
        description: form.description,
        status: form.status,
        sizes: SHOE_SIZES,
        stock,
        colors,
        images: uploaded,
        image: uploaded[0],
        totalStock,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // reset
      setForm({
        name: "",
        sku: "",
        category: "",
        price: "",
        description: "",
        status: "active",
      });
      setStock({});
      setColors([]);
      setFiles([]);
      setPreviews([]);

      alert("Product created!");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ FULL SCREEN WRAPPER FIXED
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-pink-50">
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 border-b border-pink-100 bg-white/80 backdrop-blur px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create Shoe Product</h1>
            <p className="text-sm text-gray-500">
              Full screen product management panel
            </p>
          </div>

          <div className="text-sm font-semibold text-pink-600">
            Stock: {totalStock}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-6">
        
        {/* LEFT */}
        <div className="space-y-6">
          
          {/* PRODUCT */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-4">Product Details</h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex gap-2 mb-3">
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="SKU"
                className="w-full border p-2 rounded"
              />
              <button onClick={generateSKU} className="px-3 bg-black text-white rounded">
                Gen
              </button>
            </div>

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />
          </div>

          {/* IMAGES */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <input type="file" multiple onChange={handleFiles} />

            <div className="grid grid-cols-3 gap-2 mt-4">
              {previews.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} className="h-24 w-full object-cover rounded" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black text-white rounded-full p-1">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* CATEGORY */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-3">Category</h2>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="flex mt-3 gap-2">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="New category"
              />
              <button onClick={addCategory} className="bg-black text-white px-3 rounded">
                Add
              </button>
            </div>
          </div>

          {/* STOCK */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-3">Stock</h2>

            <div className="grid grid-cols-3 gap-2">
              {SHOE_SIZES.map((s) => (
                <input
                  key={s}
                  placeholder={s}
                  type="number"
                  value={stock[s] || ""}
                  onChange={(e) => updateStock(s, Number(e.target.value))}
                  className="border p-2 rounded"
                />
              ))}
            </div>
          </div>

          {/* COLORS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-3">Colors</h2>

            <div className="flex gap-2">
              <input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button onClick={addColor} className="bg-black text-white px-3 rounded">
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {colors.map((c) => (
                <span key={c} className="bg-pink-100 px-3 py-1 rounded-full text-sm">
                  {c}
                  <button onClick={() => removeColor(c)} className="ml-2 text-red-500">x</button>
                </span>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold"
          >
            {loading ? "Saving..." : "Create Product"}
          </button>

        </div>
      </div>
    </div>
  );
}