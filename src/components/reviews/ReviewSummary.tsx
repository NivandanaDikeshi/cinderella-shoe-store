export default function ReviewSummary({ reviews }: any) {
  const total = reviews.length;

  const avg =
    total === 0
      ? 0
      : reviews.reduce(
          (sum: number, r: any) => sum + Number(r.rating || 0),
          0
        ) / total;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-xl font-bold">
        ⭐ {avg.toFixed(1)} / 5
      </p>
      <p className="text-sm text-gray-500">
        {total} customer reviews
      </p>
    </div>
  );
}