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
      <div className="flex items-start gap-4">

        {/* CLEAN BLACK ACCENT LINE */}
        <div className="h-10 w-1 rounded-full bg-gray-900" />

        <div className="flex flex-col">

          {/* TITLE ROW */}
          <div className="flex items-center gap-3">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>

            {badge && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                {badge}
              </span>
            )}

          </div>

          {/* SUBTITLE */}
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