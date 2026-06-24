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
        rounded-2xl border border-pink-100
        bg-gradient-to-br from-white via-white to-pink-50
        p-6 shadow-sm
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
      "
    >
      {/* soft glow effect */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-pink-200 blur-3xl opacity-30 rounded-full" />

      {/* header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        {/* icon */}
        {icon && (
          <div className="p-2 rounded-xl bg-pink-100 text-pink-600 shadow-sm">
            {icon}
          </div>
        )}
      </div>

      {/* value */}
      <h2
        className={`text-3xl font-bold mt-4 tracking-tight text-gray-900 ${valueClassName}`}
      >
        {value}
      </h2>

      {/* bottom accent */}
      <div className="mt-5 flex items-center gap-2">
        <div className="h-[3px] w-10 rounded-full bg-pink-500" />
        <div className="h-[3px] w-3 rounded-full bg-pink-200" />
      </div>
    </div>
  );
}