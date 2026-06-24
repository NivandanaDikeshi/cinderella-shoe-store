import ProductCard from "./ProductCard";

export default function RelatedProducts({
  products,
}: any) {
  return (
    <section className="mt-20">

      <h2 className="text-3xl font-bold mb-6">
        Related Products
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        {products.map(
          (product: any) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          )
        )}

      </div>

    </section>
  );
}