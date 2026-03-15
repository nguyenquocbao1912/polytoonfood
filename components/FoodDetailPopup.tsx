"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FoodItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import StarRating from "./StarRating";
import QuantityControl from "./QuantityControl";

interface FoodDetailPopupProps {
  food: FoodItem | null;
  onClose: () => void;
}

function isUrl(src: string) {
  return src.startsWith("http");
}

export default function FoodDetailPopup({ food, onClose }: FoodDetailPopupProps) {
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L">("M");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (food) {
      setSelectedSize(food.sizes.includes("M") ? "M" : food.sizes[0]);
      setQty(1);
    }
  }, [food]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    if (food) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [food]);

  if (!food) return null;

  const fav = isFavorite(food.id);

  const handleAddToCart = () => {
    addItem(food, selectedSize, qty);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto rounded-t-3xl animate-slide-up"
        style={{
          background: "var(--cream)",
          border: "2.5px solid #1a1a1a",
          borderBottom: "none",
          boxShadow: "0 -4px 0 #1a1a1a",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Image area */}
        <div
          className="relative h-96 flex items-center justify-center overflow-hidden"
          style={{
            background: "var(--green-light)",
            borderBottom: "2.5px solid #1a1a1a",
          }}
        >
          {isUrl(food.image) ? (
            <Image
              src={food.image}
              alt={food.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-8xl">{food.image}</span>
          )}
          {/* Dark overlay for URL images to improve text readability */}
          {isUrl(food.image) && (
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />
          )}

          <button
            onClick={onClose}
            className="neo-btn neo-btn-white absolute top-4 right-4 w-9 h-9 text-lg font-bold z-10"
          >
            ×
          </button>
          <button
            onClick={() => toggleFavorite(food)}
            className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-xl z-10"
            style={{
              background: "#fff",
              border: "2.5px solid #1a1a1a",
              boxShadow: "2px 2px 0 #1a1a1a",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? "#e63946" : "none"} stroke={fav ? "#e63946" : "#888"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {food.discount && (
            <div
              className="absolute bottom-3 left-4 neo-badge z-10"
              style={{ background: "#e63946", color: "#fff" }}
            >
              -{food.discount}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <h2
              className="text-xl font-extrabold leading-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {food.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={food.rating} size={14} />
              <span className="text-xs text-gray-500">
                ({food.reviewCount} reviews)
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{food.description}</p>
          </div>

          {/* Price */}
          <div
            className="inline-block px-4 py-2 rounded-xl font-extrabold text-2xl"
            style={{
              background: "var(--green-light)",
              border: "2.5px solid #1a1a1a",
              boxShadow: "3px 3px 0 #1a1a1a",
              color: "var(--green-primary)",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            ${food.price.toFixed(2)}
          </div>

          {/* Size */}
          <div>
            <p className="font-bold text-sm mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Size
            </p>
            <div className="flex gap-2.5">
              {(["S", "M", "L"] as const).map((s) => {
                const available = food.sizes.includes(s);
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => available && setSelectedSize(s)}
                    disabled={!available}
                    className="w-12 h-12 font-extrabold text-base rounded-xl transition-all"
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      border: "2.5px solid #1a1a1a",
                      boxShadow: active ? "3px 3px 0 #1a1a1a" : "1px 1px 0 #1a1a1a",
                      background: active ? "var(--green-primary)" : available ? "#fff" : "#f0f0f0",
                      color: active ? "#fff" : available ? "#1a1a1a" : "#bbb",
                      cursor: available ? "pointer" : "not-allowed",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="font-bold text-sm mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Quantity
            </p>
            <QuantityControl value={qty} onChange={setQty} />
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="neo-btn neo-btn-primary w-full h-14 text-lg font-extrabold"
            style={{ boxShadow: "4px 4px 0 #1a1a1a", marginBottom: "1rem" }}
          >
            🛒 Add to Cart — ${(food.price * qty).toFixed(2)}
          </button>
        </div>
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
