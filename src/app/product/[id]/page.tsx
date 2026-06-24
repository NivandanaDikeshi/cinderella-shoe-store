import {
  getProductById,
  getRelatedProducts,
} from "@/services/storefrontService";

import ProductGallery from "@/components/storefront/ProductGallery";
import ProductInfo from "@/components/storefront/ProductInfo";
import RelatedProducts from "@/components/storefront/RelatedProducts";
import WishlistButton from "@/components/storefront/WishlistButton";
import ProductReviewsSection from "@/components/reviews/ProductReviewsSection";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 📦 Get product
  const product: any = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-500">
            Product Not Found
          </h1>
          <p className="mt-3 text-gray-500">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  // 📦 Related products
  const relatedProducts = await getRelatedProducts(product.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ================= PRODUCT SECTION ================= */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* GALLERY */}
          <div className="bg-white rounded-3xl shadow-sm border p-4">
            <ProductGallery images={product.images || []} />
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border p-6">
              <ProductInfo product={product} />

              <div className="mt-5">
                <WishlistButton product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Customer Reviews ⭐
          </h2>

          <ProductReviewsSection productId={product.id} />
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-900">
            You May Also Like
          </h2>

          <RelatedProducts
            products={relatedProducts.filter((p: any) => p.id !== product.id)}
          />
        </div>
      </div>
    </div>
  );
}