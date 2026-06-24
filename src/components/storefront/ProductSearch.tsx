"use client";

interface ProductSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function ProductSearch({
  search,
  setSearch,
}: ProductSearchProps) {
  return (
    <input
      type="text"
      placeholder="Search shoes..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
    />
  );
}