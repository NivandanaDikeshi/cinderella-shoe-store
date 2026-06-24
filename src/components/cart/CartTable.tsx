"use client";

import CartItem from "./CartItem";

export default function CartTable({
  items,
  remove,
  update,
}: any) {
  return (
    <table className="w-full bg-white rounded-xl shadow">

      <thead>
        <tr className="bg-gray-100">
          <th className="p-3">
            Image
          </th>

          <th className="p-3">
            Product
          </th>

          <th className="p-3">
            Size
          </th>

          <th className="p-3">
            Color
          </th>

          <th className="p-3">
            Price
          </th>

          <th className="p-3">
            Qty
          </th>

          <th className="p-3">
            Total
          </th>

          <th className="p-3">
            Action
          </th>
        </tr>
      </thead>

      <tbody>

        {items.map(
          (item: any) => (
            <CartItem
              key={`${item.id}-${item.size}-${item.color}`}
              item={item}
              onRemove={() =>
                remove(
                  item.id,
                  item.size,
                  item.color
                )
              }
              onUpdate={(
                qty
              ) =>
                update(
                  item.id,
                  item.size,
                  item.color,
                  qty
                )
              }
            />
          )
        )}

      </tbody>

    </table>
  );
}