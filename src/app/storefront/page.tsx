import Link from "next/link";

import * as storefrontService from "@/services/storefrontService";

import FeaturedProducts from "@/components/storefront/FeaturedProducts";

export default async function StorefrontPage() {
  const featuredProducts =
    await storefrontService.getFeaturedProducts();

  return (
    <div>

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-pink-100 to-pink-50 py-24">
        <div className="container mx-auto px-4 text-center">

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Cinderella Shoe Store
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover stylish, comfortable, and elegant
            footwear for every occasion.
          </p>

          <div className="mt-8 flex justify-center gap-4">

            <Link
              href="/shop"
              className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition"
            >
              Shop Now
            </Link>

            <Link
              href="/about"
              className="border border-pink-600 text-pink-600 px-8 py-3 rounded-lg hover:bg-pink-50 transition"
            >
              Learn More
            </Link>

          </div>

        </div>
      </section>

      {/* Featured Products */}

      <section className="container mx-auto px-4 py-16">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold">
            Featured Products
          </h2>

          <Link
            href="/shop"
            className="text-pink-600 font-semibold"
          >
            View All →
          </Link>

        </div>

        <FeaturedProducts
          products={featuredProducts}
        />

      </section>

      {/* Categories */}

      <section className="bg-gray-50 py-16">

        <div className="container mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-10">
            Shop By Category
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            <Link
              href="/shop?category=Heels"
              className="bg-white p-8 rounded-xl shadow text-center hover:shadow-lg"
            >
              👠
              <h3 className="font-bold mt-3">
                Heels
              </h3>
            </Link>

            <Link
              href="/shop?category=Sneakers"
              className="bg-white p-8 rounded-xl shadow text-center hover:shadow-lg"
            >
              👟
              <h3 className="font-bold mt-3">
                Sneakers
              </h3>
            </Link>

            <Link
              href="/shop?category=Sandals"
              className="bg-white p-8 rounded-xl shadow text-center hover:shadow-lg"
            >
              🩴
              <h3 className="font-bold mt-3">
                Sandals
              </h3>
            </Link>

            <Link
              href="/shop?category=Flats"
              className="bg-white p-8 rounded-xl shadow text-center hover:shadow-lg"
            >
              🥿
              <h3 className="font-bold mt-3">
                Flats
              </h3>
            </Link>

          </div>

        </div>

      </section>

      {/* Why Choose Us */}

      <section className="container mx-auto px-4 py-16">

        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-3">
              Premium Quality
            </h3>

            <p className="text-gray-600">
              High-quality footwear designed for
              comfort and style.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-3">
              Fast Delivery
            </h3>

            <p className="text-gray-600">
              Island-wide delivery across Sri Lanka.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-3">
              Secure Payments
            </h3>

            <p className="text-gray-600">
              Safe checkout with trusted payment
              methods.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-pink-600 py-20">

        <div className="container mx-auto px-4 text-center text-white">

          <h2 className="text-4xl font-bold">
            Find Your Perfect Pair Today
          </h2>

          <p className="mt-4 text-lg">
            Browse our latest collection and step
            into style.
          </p>

          <Link
            href="/shop"
            className="inline-block mt-8 bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold"
          >
            Start Shopping
          </Link>

        </div>

      </section>

    </div>
  );
}