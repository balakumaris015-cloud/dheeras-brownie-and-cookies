import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] items-center py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-cocoa-500">404</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-cocoa-900">This page is not baked yet</h1>
        <p className="mt-4 text-cocoa-600">The page you are looking for does not exist.</p>
        <Link className="btn-primary mt-8" to="/">Back Home</Link>
      </div>
    </section>
  );
}
