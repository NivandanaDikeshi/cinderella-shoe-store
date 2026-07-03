"use client";

import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  valueClassName?: string;
  icon?: ReactNode;
  subtitle?: string;
}

export default function DashboardCard({
  title,
  value,
  valueClassName = "",
  icon,
  subtitle,
}: DashboardCardProps) {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-2xl border border-gray-200
        bg-white
        p-6 shadow-sm
        transition-all duration-300
        hover:shadow-md hover:-translate-y-1
      "
    >

      {/* TOP ROW */}
      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* ICON (CLEAN STYLE) */}
        {icon && (
          <div className="p-2 rounded-xl bg-gray-100 text-gray-700 border border-gray-200">
            {icon}
          </div>
        )}
      </div>

      {/* VALUE */}
      <h2
        className={`text-3xl font-bold mt-4 tracking-tight text-gray-900 ${valueClassName}`}
      >
        {value}
      </h2>

      {/* BOTTOM MINI INDICATOR */}
      <div className="mt-5 flex items-center gap-2">
        <div className="h-[3px] w-10 rounded-full bg-gray-900" />
        <div className="h-[3px] w-3 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}