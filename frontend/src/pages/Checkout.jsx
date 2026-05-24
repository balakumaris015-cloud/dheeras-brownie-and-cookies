import React from "react";
import QRCode from "qrcode";
import { CheckCircle2, Loader2, QrCode, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../utils/api.js";

const UPI_ID = import.meta.env.VITE_UPI_ID || "dheera@upi";
const PAYEE_NAME = import.meta.env.VITE_UPI_PAYEE_NAME || "Dheera's Brownie and Cookies";

export default function Checkout() {
  const { clearCart, items, total } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "" });
  const [qr, setQr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: String(total),
      cu: "INR",
      tn: "Bakery order"
    });
    return `upi://pay?${params.toString()}`;
  }, [total]);

  useEffect(() => {
    if (total > 0) {
      QRCode.toDataURL(upiUrl, { width: 240, margin: 2 }).then(setQr);
    }
  }, [total, upiUrl]);

  if (items.length === 0 && !success) {
    return (
      <section className="container-page flex min-h-[60vh] items-center py-16">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-cocoa-200 bg-white p-10 text-center shadow-sm">
          <h1 className="font-display text-4xl font-bold">Checkout needs a cart</h1>
          <p className="mt-3 text-cocoa-600">Add something delicious before placing an order.</p>
          <Link className="btn-primary mt-7" to="/products">Shop Products</Link>
        </div>
      </section>
    );
  }

  function updateField(event) {
    setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await createOrder({
        customer: form,
        items: items.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        payment: {
          method: "UPI",
          upiId: UPI_ID,
          status: "paid_by_customer_confirmation"
        }
      });
      setSuccess(true);
      clearCart();
      toast.success("Order placed successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="container-page flex min-h-[70vh] items-center py-16">
        <div className="success-pop mx-auto max-w-xl rounded-[2rem] border border-pistachio/30 bg-white p-10 text-center shadow-bakery">
          <CheckCircle2 className="mx-auto text-pistachio" size={64} />
          <h1 className="mt-5 font-display text-5xl font-bold text-cocoa-900">Order Placed Successfully</h1>
          <p className="mt-4 text-cocoa-600">
            Thank you. Dheera's kitchen has your order details and will confirm delivery soon.
          </p>
          <button className="btn-primary mt-8" type="button" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <h1 className="font-display text-5xl font-bold text-cocoa-900">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
        <form className="rounded-[2rem] border border-cocoa-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <label>
              <span className="mb-2 block text-sm font-bold text-cocoa-700">Customer Name</span>
              <input className="input-field" name="customerName" value={form.customerName} onChange={updateField} required />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-cocoa-700">Phone Number</span>
              <input className="input-field" name="phone" value={form.phone} onChange={updateField} pattern="[0-9+ ]{8,15}" required />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-cocoa-700">Delivery Address</span>
              <textarea className="input-field min-h-32" name="address" value={form.address} onChange={updateField} required />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-cocoa-700">Order Notes</span>
              <textarea className="input-field min-h-24" name="notes" value={form.notes} onChange={updateField} placeholder="Eggless preference, delivery time, gift message..." />
            </label>
          </div>
          <button className="btn-primary mt-7 w-full" disabled={submitting} type="submit">
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            I have paid, place order
          </button>
        </form>

        <aside className="h-fit rounded-[2rem] border border-cocoa-200 bg-white p-6 text-center shadow-sm">
          <QrCode className="mx-auto text-honey" size={34} />
          <h2 className="mt-3 font-display text-3xl font-bold">Scan & Pay</h2>
          <p className="mt-2 text-sm text-cocoa-600">Pay securely using any UPI app, then place your order.</p>
          <div className="mt-6 rounded-[1.5rem] bg-cocoa-50 p-5">
            {qr && <img src={qr} alt="UPI payment QR code" className="mx-auto h-60 w-60 rounded-xl bg-white p-3" />}
          </div>
          <div className="mt-6 space-y-3 text-left text-sm">
            <div className="flex justify-between"><span className="text-cocoa-500">Total amount</span><span className="font-bold text-cocoa-900">Rs. {total}</span></div>
            <div className="flex justify-between"><span className="text-cocoa-500">UPI ID</span><span className="font-bold text-cocoa-900">{UPI_ID}</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}
