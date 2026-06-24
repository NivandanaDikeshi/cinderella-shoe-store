"use client";

interface Props {
  customer: any;
  notes: string;
  setNotes: any;
  onSave: () => void;
}

export default function CustomerDetails({
  customer,
  notes,
  setNotes,
  onSave,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        Customer Information
      </h2>

      <div className="space-y-2">
        <p>
          <strong>Name:</strong>{" "}
          {customer.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {customer.email}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {customer.phone}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {customer.address}
        </p>

        <p>
          <strong>Total Spend:</strong>
          LKR{" "}
          {customer.totalSpent || 0}
        </p>
      </div>

      <div className="mt-6">
        <label className="font-semibold block mb-2">
          Admin Notes
        </label>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          rows={5}
          className="w-full border rounded-lg p-3"
        />

        <button
          onClick={onSave}
          className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-lg"
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}