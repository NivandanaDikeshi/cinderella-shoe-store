"use client";

import { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import { getCategories } from "@/services/categoryService";

interface Props {
  category: string;
  setCategory: (value: string) => void;
}

export default function ProductFilters({
  category,
  setCategory,
}: Props) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  return (
    <div className="relative w-full">
      <Tag
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
      >
        <option value="">All Categories</option>

        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        ▼
      </span>
    </div>
  );
}