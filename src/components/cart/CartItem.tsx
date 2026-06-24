"use client";

import Image from "next/image";

interface Props {
  item: any;
  onRemove: () => void;
  onUpdate: (
    quantity: number
  ) => void;
}

export default function CartItem({
  item,
  onRemove,
  onUpdate,
}: Props) {
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

      <td className="p-3">
        {item.name}
      </td>

      <td className="p-3">
        {item.size}
      </td>

      <td className="p-3">
        {item.color}
      </td>

      <td className="p-3">
        LKR {item.price}
      </td>

      <td className="p-3">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) =>
            onUpdate(
              Number(
                e.target.value
              )
            )
          }
          className="border p-2 rounded w-20"
        />
      </td>

      <td className="p-3">
        LKR
        {" "}
        {item.price *
          item.quantity}
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