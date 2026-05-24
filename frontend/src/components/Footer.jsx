import React from "react";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-cocoa-900 text-cocoa-100">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-bold">Dheera's Brownie and Cookies</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-cocoa-200">
            Small-batch brownies and cookies baked fresh for celebrations, gifting, and everyday
            dessert cravings.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-cocoa-300">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-cocoa-200">
            <p className="flex items-center gap-3"><Phone size={16} /> +91 98765 43210</p>
            <p className="flex items-center gap-3"><Mail size={16} /> hello@dheerasbakery.com</p>
            <p className="flex items-center gap-3"><MapPin size={16} /> Bengaluru, India</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-cocoa-300">Follow</h3>
          <div className="mt-4 flex gap-3">
            <a className="rounded-full bg-white/10 p-3 transition hover:bg-white/20" href="#" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a className="rounded-full bg-white/10 p-3 transition hover:bg-white/20" href="#" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-cocoa-300">
        (c) {new Date().getFullYear()} Dheera's Brownie and Cookies. Freshly baked with love.
      </div>
    </footer>
  );
}
