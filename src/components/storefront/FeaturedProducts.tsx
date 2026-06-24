type Product = any;
function ProductCard({ product }: { product: Product }) {
  return (
    <article className="border rounded p-4">
      {product?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product?.name || 'product'} className="w-full h-40 object-cover mb-2" />
      )}
      <h3 className="font-semibold">{product?.name || 'Untitled'}</h3>
      <p className="text-sm text-gray-600">{product?.price ? `$${product.price}` : ''}</p>
    </article>
  );
}

export default function FeaturedProducts({ products }: { products?: Product[] }) {
  return (
    <section className="py-16">

      <h2 className="text-3xl font-bold mb-8">Featured Products</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {(products || []).map((product: Product) => (
          <ProductCard key={product?.id} product={product} />
        ))}
      </div>

    </section>
  );
}