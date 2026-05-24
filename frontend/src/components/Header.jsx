import React from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Cart", href: "/cart" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { totalQuantity } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-cocoa-200/70 bg-cocoa-50/90 backdrop-blur-xl">
      <nav className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cocoa-800 text-lg font-bold text-cocoa-50">
            D
          </span>
          <span>
            <span className="block font-display text-xl font-bold leading-tight text-cocoa-800">
              Dheera's
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-cocoa-500">
              Brownie & Cookies
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-cocoa-900 ${
                  isActive ? "text-cocoa-900" : "text-cocoa-500"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="btn-secondary relative h-11 px-4 py-0" aria-label="Open cart">
            <ShoppingBag size={18} />
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry px-1 text-xs font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
          <button
            className="btn-secondary h-11 px-3 py-0 md:hidden"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-cocoa-200 bg-cocoa-50 md:hidden">
          <div className="container-page grid gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-cocoa-700 hover:bg-cocoa-100"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
