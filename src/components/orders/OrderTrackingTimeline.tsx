"use client";

import { Package, CheckCircle, Truck, Home } from "lucide-react";

interface Props {
  status?: string;
}

export default function OrderTrackingTimeline({ status }: Props) {
  const steps = [
    { label: "Order Placed", icon: Package },
    { label: "Processing", icon: Package },
    { label: "Dispatched", icon: Truck },
    { label: "Delivered", icon: Home },
  ];

  const getActiveIndex = () => {
    switch (status) {
      case "Pending":
        return 0;
      case "Processing":
        return 1;
      case "Dispatched":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const active = getActiveIndex();

  return (
    <div className="flex items-center justify-between mt-4">

      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= active;

        return (
          <div key={index} className="flex flex-col items-center flex-1">

            {/* ICON */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition
              ${
                isActive
                  ? "bg-pink-600 border-pink-600 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              <Icon size={16} />
            </div>

            {/* LABEL */}
            <p className="text-xs mt-2 text-center text-gray-600">
              {step.label}
            </p>

            {/* LINE */}
            {index !== steps.length - 1 && (
              <div className="w-full h-1 bg-gray-200 mt-3 relative">
                <div
                  className={`h-1 transition-all ${
                    isActive ? "bg-pink-600" : "bg-gray-200"
                  }`}
                />
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}