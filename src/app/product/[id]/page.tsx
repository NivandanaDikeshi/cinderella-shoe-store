import ProductReviews from "@/components/reviews/ProductReviews";

async function getProductById(id: string) {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  
  const product = await getProductById(params.id);

  // ❌ Not found UI
  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-red-500 text-2xl font-bold">
          Product not found
        </h1>
        <p className="text-gray-500 mt-2">
          Please check the URL or go back to shop.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* PRODUCT INFO */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          {product.name}
        </h1>

        <p className="text-gray-600 mt-2">
          {product.description}
        </p>

        <p className="text-xl font-semibold mt-4 text-pink-600">
          Rs. {product.price}
        </p>
      </div>

      {/* REVIEWS SECTION */}
      <div className="mt-10">
        <ProductReviews productId={params.id} />
      </div>
    </div>
  );
}