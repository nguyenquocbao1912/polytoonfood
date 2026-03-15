"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FoodCard from "@/components/FoodCard";
import FoodDetailPopup from "@/components/FoodDetailPopup";
import SidebarLayout from "@/components/SidebarLayout";
import { searchFoodsAPI } from "@/lib/api";
import { FoodItem } from "@/lib/types";

function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const search = debounce(() => {
      searchFoodsAPI(query).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }, 500);

    search();
  }, [query]);

  return (
    <>
      <Header />
      <SidebarLayout>
        <main className="flex-1 min-w-0 px-4 py-5 pb-24 lg:pb-8 space-y-5 md:px-6 w-full max-w-6xl mx-auto">
          <h1
            className="text-2xl font-extrabold"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            🔍 Search Food
          </h1>

          {/* Search input */}
          <div
            className="flex items-center gap-2 p"
            style={{
              background: "#fff",
              border: "2.5px solid #1a1a1a",
              borderRadius: "12px",
              boxShadow: "4px 4px 0 #1a1a1a",
              padding: "4px 7px 4px 14px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for pizza, burgers, sushi..."
              className="flex-1 bg-transparent text-xl outline-none py-2"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="neo-btn neo-btn-light w-10 aspect-square text-base flex flex-shrink-0"
              >
                ×
              </button>
            )}
          </div>

          {query.trim().length === 0 ? (
            // Popular categories shortcuts
            <div>
              <p className="font-bold text-sm mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Popular categories
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: "🍕", name: "Pizza", slug: "pizza" },
                  { emoji: "🍔", name: "Burgers", slug: "burgers" },
                  { emoji: "🍣", name: "Sushi", slug: "sushi" },
                  { emoji: "🥗", name: "Salads", slug: "salads" },
                  { emoji: "🍰", name: "Desserts", slug: "desserts" },
                  { emoji: "🍜", name: "Noodles", slug: "noodles" },
                ].map((c) => (
                  <a
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="neo-card flex flex-col items-center gap-2 p-4 text-center"
                    style={{ background: "var(--green-light)" }}
                  >
                    <span className="text-3xl">{c.emoji}</span>
                    <span className="font-bold text-xs" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      {c.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="domino-dots">
                <div /><div /><div />
              </div>
              <p className="font-bold font-space text-gray-500">Searching our menu... 🔍</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-3">🔍</p>
              <p className="font-bold text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                No results for "{query}"
              </p>
              <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-lg mb-3 text-gray-500">
                {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    variant="grid"
                    onClick={() => setSelectedFood(food)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </SidebarLayout>
      <FoodDetailPopup food={selectedFood} onClose={() => setSelectedFood(null)} />
    </>
  );
}
