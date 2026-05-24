import React from "react";
import { ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";
import CartLineItem from "../components/CartLineItem.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, subtotal, total } = useCart();

  if (items.length === 0) {
    return (
      <section className="container-page flex min-h-[60vh] items-center py-16">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-cocoa-300 bg-white p-10 text-center shadow-sm">
          <ShoppingBasket className="mx-auto text-honey" size={48} />
          <h1 className="mt-5 font-display text-4xl font-bold text-cocoa-900">Your cart is empty</h1>
          <p className="mt-3 text-cocoa-600">Add brownies and cookies to start a cozy dessert box.</p>
          <Link className="btn-primary mt-7" to="/products">Browse Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <h1 className="font-display text-5xl font-bold text-cocoa-900">Shopping cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => <CartLineItem key={item._id} item={item} />)}
        </div>
        <aside className="h-fit rounded-[1.5rem] border border-cocoa-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-3xl font-bold text-cocoa-900">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between text-cocoa-600"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
            <div className="flex justify-between text-cocoa-600"><span>Delivery</span><span>Calculated offline</span></div>
            <div className="border-t border-cocoa-200 pt-4">
              <div className="flex justify-between text-lg font-bold text-cocoa-900"><span>Total</span><span>Rs. {total}</span></div>
            </div>
          </div>
          <Link className="btn-primary mt-7 w-full" to="/checkout">Proceed to Checkout</Link>
        </aside>
      </div>
    </section>
  );
}
