"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import QuantityControl from "@/components/QuantityControl";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const { items, totalPrice, updateQty, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    address: "",
    firstName: "",
    email: "",
    paymentMethod: "credit-card",
  });
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fee = 3;
  const tax = 0;
  const total = totalPrice + fee + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        userId: user ? user.uid : "guest",
        items,
        total,
        address: form.address,
        createdAt: serverTimestamp(),
        status: "processing"
      };

      await addDoc(collection(db, "orders"), orderData);

      setSubmitted(true);
      clearCart();
      setTimeout(() => router.push("/orders"), 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
        style={{ background: "var(--green-light)" }}
      >
        <div
          className="neo-card text-center p-10 max-w-sm w-full"
          style={{ background: "#fff" }}
        >
          <div className="text-7xl mb-4">🎉</div>
          <h1
            className="text-2xl font-extrabold"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "var(--green-primary)" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Saved to your order history. Redirecting...
          </p>
          <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: "var(--green-light)", border: "2px solid #1a1a1a" }}>
            <div
              className="h-full rounded-full animate-progress"
              style={{ background: "var(--green-primary)" }}
            />
          </div>
        </div>
        <style jsx global>{`
          @keyframes progress { from { width: 0; } to { width: 100%; } }
          .animate-progress { animation: progress 3s linear; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Header showBack backHref="/" title="Checkout" />
      <main className="px-4 py-5 pb-24 md:pb-8 md:px-6 md:max-w-4xl md:mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="md:grid md:grid-cols-2 md:gap-6 space-y-5 md:space-y-0">
            {/* Left column */}
            <div className="space-y-5">
              {/* Delivery Address */}
              <section className="neo-card p-5 space-y-3">
                <h2
                  className="text-base font-extrabold flex items-center gap-2"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  📍 Delivery Address
                </h2>
                {/* Map placeholder */}
                <div
                  className="h-36 rounded-xl flex items-center justify-center text-4xl"
                  style={{ background: "var(--green-light)", border: "2px solid #1a1a1a" }}
                >
                  🗺️
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Street Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="neo-input text-sm col-span-2"
                  />
                  <input
                    required
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="neo-input text-sm"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="neo-input text-sm"
                  />
                </div>
              </section>

              {/* Payment */}
              <section className="neo-card p-5 space-y-3">
                <h2
                  className="text-base font-extrabold flex items-center gap-2"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  💳 Payment Method
                </h2>
                {["credit-card", "paypal", "cash"].map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                    style={{
                      border: "2px solid #1a1a1a",
                      background: form.paymentMethod === m ? "var(--green-light)" : "#fff",
                      boxShadow: form.paymentMethod === m ? "2px 2px 0 #1a1a1a" : "none",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m}
                      checked={form.paymentMethod === m}
                      onChange={() => setForm({ ...form, paymentMethod: m })}
                      className="accent-green-600"
                    />
                    <span className="font-semibold text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      {m === "credit-card" ? "💳 Credit / Debit Card" : m === "paypal" ? "🅿️ PayPal" : "💵 Cash on Delivery"}
                    </span>
                  </label>
                ))}
              </section>
            </div>

            {/* Right column: Order Summary */}
            <div className="space-y-5">
              <section className="neo-card p-5 space-y-4">
                <h2
                  className="text-base font-extrabold flex items-center gap-2"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  🛒 Order Summary
                </h2>
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.food.id}-${item.selectedSize}`}
                      className="flex items-center gap-3 py-2"
                      style={{ borderBottom: "1.5px dashed #ddd" }}
                    >
                      <div
                        className="w-16 aspect-square flex-shrink-0 flex items-center justify-center text-2xl rounded-lg"
                        style={{ background: "var(--green-light)", border: "2px solid #1a1a1a" }}
                      >
                        {item.food.image.startsWith("http") ? (
                          <Image src={item.food.image} alt={item.food.name} width={48} height={48} className="object-cover rounded-lg w-full h-full" unoptimized />
                        ) : (
                          item.food.image
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          {item.food.name}
                        </p>
                        <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <QuantityControl
                          value={item.quantity}
                          onChange={(v) => updateQty(item.food.id, item.selectedSize, v)}
                          min={1}
                        />
                        <span className="text-xs font-bold" style={{ color: "var(--green-primary)" }}>
                          ${(item.food.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </section>

              {/* Bill details */}
              <section className="neo-card p-5 space-y-2">
                <h2
                  className="text-base font-extrabold mb-3"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  🧾 Bill Details
                </h2>
                <BillRow label="Subtotal" value={`$${totalPrice.toFixed(2)}`} />
                <BillRow label="Delivery Fee" value={`$${fee.toFixed(2)}`} />
                <BillRow label="Tax" value={`$${tax.toFixed(2)}`} />
                <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: 12, marginTop: 8 }}>
                  <BillRow
                    label="Total"
                    value={`$${total.toFixed(2)}`}
                    bold
                    green
                  />
                </div>
              </section>

              <button
                type="submit"
                disabled={items.length === 0 || isSubmitting}
                className="neo-btn neo-btn-primary w-full h-14 text-lg font-extrabold"
                style={{
                  boxShadow: "4px 4px 0 #1a1a1a",
                  opacity: (items.length === 0 || isSubmitting) ? 0.5 : 1,
                  cursor: (items.length === 0 || isSubmitting) ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Processing..." : "Place Order →"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

function BillRow({
  label,
  value,
  bold,
  green,
}: {
  label: string;
  value: string;
  bold?: boolean;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className="text-sm"
        style={{ fontWeight: bold ? 700 : 500, fontFamily: bold ? "Space Grotesk, sans-serif" : undefined }}
      >
        {label}
      </span>
      <span
        className="text-sm font-bold"
        style={{
          color: green ? "var(--green-primary)" : "#1a1a1a",
          fontSize: bold ? "1rem" : "0.875rem",
          fontFamily: "Space Grotesk, sans-serif",
        }}
      >
        {value}
      </span>
    </div>
  );
}
