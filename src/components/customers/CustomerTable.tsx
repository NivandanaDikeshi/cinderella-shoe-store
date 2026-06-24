"use client";

import Link from "next/link";

interface Props {
  customers: any[];
}

export default function CustomerTable({
  customers,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">
              Name
            </th>

            <th className="p-3 text-left">
              Phone
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-left">
              Total Spend
            </th>

            <th className="p-3 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.length > 0 ? (
            customers.map(
              (customer) => (
                <tr
                  key={customer.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {customer.name}
                  </td>

                  <td className="p-3">
                    {customer.phone}
                  </td>

                  <td className="p-3">
                    {customer.email}
                  </td>

                  <td className="p-3">
                    LKR{" "}
                    {customer.totalSpent ||
                      0}
                  </td>

                  <td className="p-3">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-6 text-gray-500"
              >
                No Customers Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}