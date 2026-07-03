"use client";

import Image from "next/image";

interface Props {
  item: any;
  onRemove: () => void;
  onUpdate: (quantity: number) => void;
  onUpdateSize?: (size: string) => void;
  onUpdateColor?: (color: string) => void;
}

export default function CartItem({
  item,
  onRemove,
  onUpdate,
  onUpdateSize,
  onUpdateColor,
}: Props) {
  const sizes = item.sizes || [];
  const colors = item.colors || [];

  return (
    <tr className="border-t">

      <td className="p-3">
        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="rounded"
        />
      </td>

      <td className="p-3 font-medium">{item.name}</td>

      {/* SIZES */}
      <td className="p-3">
        {sizes.length ? (
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s: string) => (
              <button
                key={s}
                onClick={() => onUpdateSize?.(s)}
                className={`px-2 py-1 border rounded ${
                  item.size === s ? "bg-black text-white" : ""
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          "No sizes"
        )}
      </td>

      {/* COLORS */}
      <td className="p-3">
        {colors.length ? (
          <div className="flex gap-2 flex-wrap">
            {colors.map((c: string) => (
              <button
                key={c}
                onClick={() => onUpdateColor?.(c)}
                className={`px-2 py-1 border rounded ${
                  item.color === c ? "bg-pink-600 text-white" : ""
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          "No colors"
        )}
      </td>

      <td className="p-3">LKR {item.price}</td>

      <td className="p-3">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => onUpdate(Number(e.target.value))}
          className="border p-2 w-16"
        />
      </td>

      <td className="p-3 font-bold">
        LKR {item.price * item.quantity}
      </td>

      <td className="p-3">
        <button
          onClick={onRemove}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Remove
        </button>
      </td>

    </tr>
  );
}