"use client";

export default function OrderTracking({ status }: { status: string }) {
  const steps = ["Pending", "Processing", "Dispatched", "Completed"];

  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex gap-4 mt-6">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`px-4 py-2 rounded-lg text-sm ${
            index <= currentIndex
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}