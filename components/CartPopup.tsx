"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import QuantityControl from "./QuantityControl";
import Link from "next/link";
import Image from "next/image";

export default function CartPopup() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQty, totalPrice } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setIsCartOpen]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={() => setIsCartOpen(false)}
      />
      {/* Panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto rounded-t-3xl animate-slide-up"
        style={{
          background: "var(--cream)",
          border: "2.5px solid #1a1a1a",
          borderBottom: "none",
          boxShadow: "0 -4px 0 #1a1a1a",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-5 py-4"
          style={{ background: "var(--cream)", borderBottom: "2.5px solid #1a1a1a" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2
              className="text-xl font-extrabold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              My Cart
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="neo-btn neo-btn-light w-9 h-9 text-lg font-bold"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-5xl mb-3">🛒</p>
              <p className="font-bold text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Your cart is empty
              </p>
              <p className="text-sm text-gray-500 mt-1">Add some delicious food!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.food.id}-${item.selectedSize}`}
                className="neo-card-sm flex items-center gap-3 p-3"
              >
                <div
                  className="w-24 aspect-square flex-shrink-0 flex items-center justify-center text-3xl rounded-lg"
                  style={{ background: "var(--green-light)", border: "2px solid #1a1a1a" }}
                >
                  {item.food.image.startsWith('http') ? (
                    <Image src={item.food.image} alt={item.food.name} width={96} height={96} className="object-cover rounded-lg w-full h-full" unoptimized />
                  ) : (
                    item.food.image
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    {item.food.name}
                  </p>
                  <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                  <p className="font-bold text-sm" style={{ color: "var(--green-primary)" }}>
                    ${item.food.price}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    onClick={() => removeItem(item.food.id, item.selectedSize)}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                  <QuantityControl
                    value={item.quantity}
                    onChange={(v) => updateQty(item.food.id, item.selectedSize, v)}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="sticky bottom-0 px-5 py-4"
            style={{ background: "var(--cream)", borderTop: "2.5px solid #1a1a1a" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Total
              </span>
              <span
                className="text-2xl font-extrabold"
                style={{ color: "var(--green-primary)", fontFamily: "Space Grotesk, sans-serif" }}
              >
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="neo-btn neo-btn-primary w-full h-14 text-lg"
              style={{ boxShadow: "4px 4px 0 #1a1a1a" }}
            >
              Checkout →
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
