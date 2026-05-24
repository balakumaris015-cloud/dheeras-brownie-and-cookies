import React from "react";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { fallbackProducts } from "../data/fallbackProducts.js";
import { getProducts } from "../utils/api.js";

const filters = ["all", "brownies", "cookies"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.products))
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesFilter = filter === "all" || product.category === filter;
      const searchText = `${product.name} ${product.description}`.toLowerCase();
      return matchesFilter && searchText.includes(query.toLowerCase());
    });
  }, [filter, products, query]);

  return (
    <section className="container-page py-12">
      <div className="mb-8">
        <h1 className="font-display text-5xl font-bold text-cocoa-900">Fresh bakery menu</h1>
        <p className="mt-4 max-w-2xl text-cocoa-600">
          Search, filter, and add your favorite homemade brownies and cookies to the cart.
        </p>
      </div>

      <div className="mb-8 grid gap-4 rounded-[1.5rem] border border-cocoa-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa-400" size={18} />
          <input
            className="input-field pl-11"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brownies, cookies, chocolate..."
            type="search"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${
                filter === item ? "bg-cocoa-800 text-white" : "bg-cocoa-100 text-cocoa-700 hover:bg-cocoa-200"
              }`}
              type="button"
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : filteredProducts.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>

      {!loading && filteredProducts.length === 0 && (
        <div className="rounded-[1.5rem] border border-dashed border-cocoa-300 bg-white p-10 text-center">
          <h2 className="font-display text-3xl font-bold">No bakes found</h2>
          <p className="mt-2 text-cocoa-600">Try another search or switch the category filter.</p>
        </div>
      )}
    </section>
  );
}
