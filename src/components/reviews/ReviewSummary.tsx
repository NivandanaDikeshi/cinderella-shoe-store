export default function ReviewSummary({ reviews }: any) {
  const total = reviews.length;

  const avg =
    total === 0
      ? 0
      : reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border mt-4">

      <p className="text-lg font-bold">
        ⭐ {avg.toFixed(1)} / 5
      </p>

      <p className="text-gray-500 text-sm">
        {total} customer reviews
      </p>

    </div>
  );
}