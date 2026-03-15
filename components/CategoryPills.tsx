"use client";

import Link from "next/link";
import { categories } from "@/lib/api";

interface CategoryPillsProps {
  activeSlug?: string;
}

export default function CategoryPills({ activeSlug }: CategoryPillsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
      <Link
        href="/"
        className="neo-btn flex-shrink-0 px-4 py-2 text-md gap-1.5"
        style={
          !activeSlug
            ? {
              background: "var(--green-primary)",
              color: "#fff",
              boxShadow: "2px 2px 0 #1a1a1a",
              border: "2px solid #1a1a1a",
              borderRadius: "999px",
            }
            : {
              background: "#fff",
              color: "#1a1a1a",
              boxShadow: "2px 2px 0 #1a1a1a",
              border: "2px solid #1a1a1a",
              borderRadius: "999px",
            }
        }
      >
        <span>🍽️</span>
        <span className="font-semibold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          All
        </span>
      </Link>
      {categories.map((cat) => {
        const active = activeSlug === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="neo-btn flex-shrink-0 px-4 py-2 text-md gap-1.5"
            style={
              active
                ? {
                  background: "var(--green-primary)",
                  color: "#fff",
                  boxShadow: "2px 2px 0 #1a1a1a",
                  border: "2px solid #1a1a1a",
                  borderRadius: "999px",
                }
                : {
                  background: "#fff",
                  color: "#1a1a1a",
                  boxShadow: "2px 2px 0 #1a1a1a",
                  border: "2px solid #1a1a1a",
                  borderRadius: "999px",
                }
            }
          >
            <span>{cat.emoji}</span>
            <span className="font-semibold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              {cat.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
