"use client";

import { useState } from "react";

const promos = [
  { id: 1, title: "20% Off Your First Order!", subtitle: "Use code POLY20", bg: "var(--green-primary)", textColor: "#fff" },
  { id: 2, title: "Free Delivery Today 🎉", subtitle: "On orders above $15", bg: "var(--green-dark)", textColor: "#fff" },
  { id: 3, title: "New: Sushi Collection 🍣", subtitle: "Fresh daily, order now", bg: "#1a1a1a", textColor: "var(--green-mid)" },
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative">
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ border: "2.5px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a" }}
      >
        {/* Slide */}
        <div
          className="h-32 md:h-40 flex items-center px-6 transition-all duration-300"
          style={{ background: promos[current].bg }}
        >
          {/* Decorative blob */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full opacity-20"
            style={{ background: "#fff" }}
          />
          <div
            className="absolute right-12 top-2 w-12 h-12 rounded-full opacity-10"
            style={{ background: "#fff" }}
          />
          <div className="relative z-10">
            <p
              className="text-2xl md:text-3xl font-extrabold leading-tight"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                color: promos[current].textColor,
              }}
            >
              {promos[current].title}
            </p>
            <p
              className="text-sm font-medium mt-1 opacity-80"
              style={{ color: promos[current].textColor }}
            >
              {promos[current].subtitle}
            </p>
          </div>
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {promos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? "var(--green-primary)" : "#ccc",
              border: "2px solid #1a1a1a",
            }}
          />
        ))}
      </div>
    </div>
  );
}
