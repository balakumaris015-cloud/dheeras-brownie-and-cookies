import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function CartLineItem({ item }) {
  const { decrease, increase, removeItem } = useCart();

  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-cocoa-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto] sm:items-center">
      <img src={item.image} alt={item.name} className="h-28 w-full rounded-2xl object-cover sm:w-28" />
      <div>
        <h3 className="font-display text-2xl font-bold text-cocoa-900">{item.name}</h3>
        <p className="mt-1 text-sm text-cocoa-500">Rs. {item.price} each</p>
        <button
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-berry hover:text-cocoa-900"
          type="button"
          onClick={() => removeItem(item._id)}
        >
          <Trash2 size={16} /> Remove
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="flex items-center rounded-full border border-cocoa-200 bg-cocoa-50">
          <button className="p-3" type="button" onClick={() => decrease(item._id)} aria-label={`Decrease ${item.name}`}>
            <Minus size={16} />
          </button>
          <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
          <button className="p-3" type="button" onClick={() => increase(item._id)} aria-label={`Increase ${item.name}`}>
            <Plus size={16} />
          </button>
        </div>
        <p className="text-lg font-bold text-cocoa-900">Rs. {item.price * item.quantity}</p>
      </div>
    </div>
  );
}
