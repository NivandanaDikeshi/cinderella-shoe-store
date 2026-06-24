"use client";

import {
  useEffect,
  useState,
} from "react";

import { getCategories }
  from "@/services/categoryService";

interface Props {
  category: string;
  setCategory: (
    value: string
  ) => void;
}

export default function ProductFilters({
  category,
  setCategory,
}: Props) {
  const [categories, setCategories] =
    useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories =
    async () => {
      const data =
        await getCategories();

      setCategories(data);
    };

  return (
    <select
      value={category}
      onChange={(e) =>
        setCategory(
          e.target.value
        )
      }
      className="border rounded-lg p-3"
    >
      <option value="">
        All Categories
      </option>

      {categories.map((cat) => (
        <option
          key={cat.id}
          value={cat.name}
        >
          {cat.name}
        </option>
      ))}
    </select>
  );
}