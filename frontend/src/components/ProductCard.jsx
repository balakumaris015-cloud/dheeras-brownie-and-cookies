import React from "react";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-cocoa-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-bakery">
      <div className="aspect-[4/3] overflow-hidden bg-cocoa-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cocoa-400">
              {product.category}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-cocoa-900">{product.name}</h3>
          </div>
          <p className="shrink-0 rounded-full bg-cocoa-100 px-3 py-1 text-sm font-bold text-cocoa-800">
            Rs. {product.price}
          </p>
        </div>
        <p className="min-h-12 text-sm leading-6 text-cocoa-600">{product.description}</p>
        <button className="btn-primary w-full" type="button" onClick={() => addItem(product)}>
          <Plus size={18} /> Add to Cart
        </button>
      </div>
    </article>
  );
}
