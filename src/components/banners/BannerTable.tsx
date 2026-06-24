"use client";

import Image from "next/image";

interface Props {
  banners: any[];
  onDelete: (
    id: string
  ) => Promise<void>;
}

export default function BannerTable({
  banners,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">
              Image
            </th>

            <th className="p-3 text-left">
              Title
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-left">
              Order
            </th>

            <th className="p-3 text-left">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {banners.length > 0 ? (
            banners.map((banner) => (
              <tr
                key={banner.id}
                className="border-t"
              >
                <td className="p-3">
                  <Image
                    src={
                      banner.imageUrl
                    }
                    alt={
                      banner.title
                    }
                    width={120}
                    height={60}
                    className="rounded"
                  />
                </td>

                <td className="p-3">
                  {banner.title}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      banner.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {banner.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td className="p-3">
                  {
                    banner.displayOrder
                  }
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      onDelete(
                        banner.id
                      )
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-6 text-gray-500"
              >
                No banners found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}