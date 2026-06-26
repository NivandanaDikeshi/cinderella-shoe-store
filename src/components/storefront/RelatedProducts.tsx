import ProductCard from "./ProductCard";

export default function RelatedProducts({
  products,
}: any) {
  if (!products || products.length === 0) {
    return (
      <section className="mt-12 sm:mt-16 lg:mt-20">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Related Products
        </h2>

        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-gray-500">
          No related products found.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 sm:mt-16 lg:mt-20">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        Related Products
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}