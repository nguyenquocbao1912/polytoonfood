"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FoodCard from "@/components/FoodCard";
import FoodDetailPopup from "@/components/FoodDetailPopup";
import CategoryPills from "@/components/CategoryPills";
import SidebarLayout from "@/components/SidebarLayout";
import { FoodItem, Category } from "@/lib/types";

export default function CategoryPageClient({ initialFoods, cat, slug }: { initialFoods: FoodItem[], cat: Category, slug: string }) {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  const sorted = [...initialFoods].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <>
      <Header showBack backHref="/" title={`${cat.emoji} ${cat.name}`} />

      <SidebarLayout>
        <main className="flex-1 min-w-0 px-4 py-5 pb-24 lg:pb-8 space-y-5 md:px-6 w-full overflow-hidden">
          <section className="mb-2">
            <CategoryPills activeSlug={slug} />
          </section>

          {/* Category header */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: "var(--green-light)",
              border: "2.5px solid #1a1a1a",
              boxShadow: "4px 4px 0 #1a1a1a",
            }}
          >
            <span className="text-5xl">{cat.emoji}</span>
            <div>
              <h1 className="text-2xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                {cat.name}
              </h1>
              <p className="text-sm text-gray-600">{sorted.length} items available</p>
            </div>
          </div>

          {/* Sort bar */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 max-w-[100vw]">
            <span className="text-sm font-semibold flex-shrink-0" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Sort:
            </span>
            {(
              [
                { val: "default", label: "Default" },
                { val: "rating", label: "⭐ Top Rated" },
                { val: "price-asc", label: "💲 Low to High" },
                { val: "price-desc", label: "💲 High to Low" },
              ] as const
            ).map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setSort(val)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg"
                style={{
                  border: "2px solid #1a1a1a",
                  boxShadow: sort === val ? "2px 2px 0 #1a1a1a" : "none",
                  background: sort === val ? "var(--green-primary)" : "#fff",
                  color: sort === val ? "#fff" : "#1a1a1a",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {sorted.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">{cat.emoji}</p>
              <p className="font-bold text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                No items in this category yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  variant="grid"
                  onClick={() => setSelectedFood(food)}
                />
              ))}
            </div>
          )}
        </main>
      </SidebarLayout>

      <FoodDetailPopup food={selectedFood} onClose={() => setSelectedFood(null)} />
    </>
  );
}
