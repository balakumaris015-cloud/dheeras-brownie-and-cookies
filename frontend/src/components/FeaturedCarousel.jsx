import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";

export default function FeaturedCarousel({ products }) {
  const featured = useMemo(() => products.filter((product) => product.featured), [products]);
  const [index, setIndex] = useState(0);

  if (!featured.length) return null;

  const current = featured[index % featured.length];

  return (
    <section className="container-page py-16">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-4xl font-bold text-cocoa-900">Featured bakes</h2>
          <p className="mt-3 max-w-2xl text-cocoa-600">
            Dessert-box favorites chosen for their gooey centers, crisp edges, and gift-ready finish.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary h-11 px-3 py-0" type="button" onClick={() => setIndex((value) => (value - 1 + featured.length) % featured.length)} aria-label="Previous product">
            <ChevronLeft size={20} />
          </button>
          <button className="btn-secondary h-11 px-3 py-0" type="button" onClick={() => setIndex((value) => (value + 1) % featured.length)} aria-label="Next product">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-md">
        <ProductCard product={current} />
      </div>
    </section>
  );
}
