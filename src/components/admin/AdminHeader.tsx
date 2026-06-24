"use client";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function AdminHeader({
  title,
  subtitle,
  badge,
}: AdminHeaderProps) {
  return (
    <div className="mb-8 space-y-2">

      {/* TOP ROW */}
      <div className="flex items-center gap-3">

        {/* Accent line */}
        <div className="h-10 w-1 rounded-full bg-gradient-to-b from-pink-400 to-pink-600" />

        <div className="flex flex-col">

          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>

            {badge && (
              <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-600 font-semibold">
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              {subtitle}
            </p>
          )}

        </div>
      </div>

    </div>
  );
}