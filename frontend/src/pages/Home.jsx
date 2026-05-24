import React from "react";
import { ArrowRight, Gift, Heart, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeaturedCarousel from "../components/FeaturedCarousel.jsx";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { fallbackProducts } from "../data/fallbackProducts.js";
import { getProducts } from "../utils/api.js";

const whyChooseUs = [
  { icon: Heart, title: "Small-batch baking", text: "Every box is prepared in limited batches for better texture and freshness." },
  { icon: Sparkles, title: "Premium ingredients", text: "Real cocoa, toasted nuts, rich chocolate, and balanced sweetness in every bite." },
  { icon: Gift, title: "Gift-ready packs", text: "Neat packaging for birthdays, office treats, return gifts, and festive hampers." },
  { icon: ShieldCheck, title: "Made to order", text: "Your order is baked close to delivery time, not pulled from a stale shelf." }
];

const reviews = [
  { name: "Ananya R.", text: "The Nutella brownie was rich without being too sweet. Beautiful packaging too.", rating: 5 },
  { name: "Karthik S.", text: "Ordered cookies for a team meeting and they disappeared in minutes.", rating: 5 },
  { name: "Meera P.", text: "Fresh, soft, and packed with care. The walnut brownie is now a family favorite.", rating: 5 }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.products))
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero-grid">
        <div className="container-page grid min-h-[calc(100vh-5rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl font-bold leading-[1.04] text-cocoa-900 sm:text-6xl lg:text-7xl">
              Dheera's Brownie and Cookies
            </h1>
            <p className="mt-6 text-xl font-semibold text-cocoa-700">
              Freshly baked brownies and cookies made with love
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-cocoa-600">
              Homemade dessert boxes with fudgy brownies, soft cookies, and cozy bakery flavors
              crafted for gifting, sharing, and quiet late-night cravings.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" to="/products">
                Shop Products <ArrowRight size={18} />
              </Link>
              <Link className="btn-secondary" to="/checkout">
                Quick Checkout
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/70 bg-white/65 p-4 shadow-bakery backdrop-blur">
            <img
              src="/assets/hero-bakery.svg"
              alt="Fresh brownies and cookies on a bakery counter"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover"
            />
          </div>
        </div>
      </section>

      <FeaturedCarousel products={products} />

      <section className="container-page py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-4xl font-bold text-cocoa-900">Best sellers</h2>
            <p className="mt-3 max-w-2xl text-cocoa-600">
              A warm mix of brownies and cookies that travel well, slice cleanly, and taste homemade.
            </p>
          </div>
          <Link className="btn-secondary" to="/products">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
            : products.slice(0, 3).map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="bg-white/65 py-16">
        <div className="container-page">
          <h2 className="font-display text-4xl font-bold text-cocoa-900">Why choose us</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-cocoa-200 bg-cocoa-50 p-6">
                <item.icon className="text-honey" size={28} />
                <h3 className="mt-5 text-lg font-bold text-cocoa-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-cocoa-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="font-display text-4xl font-bold text-cocoa-900">Customer reviews</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.name} className="rounded-[1.5rem] border border-cocoa-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-honey">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-5 text-sm leading-6 text-cocoa-700">"{review.text}"</blockquote>
              <figcaption className="mt-5 font-bold text-cocoa-900">{review.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
