"use client";

import { useState, useEffect, useRef } from "react";
import PromoBanner from "@/components/PromoBanner";
import CategoryPills from "@/components/CategoryPills";
import FoodCard from "@/components/FoodCard";
import FoodDetailPopup from "@/components/FoodDetailPopup";
import SidebarLayout from "@/components/SidebarLayout";
import { FoodItem } from "@/lib/types";
import Header from "@/components/Header";

export default function HomePageClient({ initialFoods }: { initialFoods: FoodItem[] }) {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  
  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(4);
  const observerTarget = useRef(null);

  // Horizontal Scroll Ref for Mobile
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, initialFoods.length));
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [initialFoods.length]);

  const hotSaleFoods = initialFoods.filter((f) => f.discount).slice(0, 6);
  const allRecommendedFoods = [...initialFoods].sort((a, b) => b.rating - a.rating);
  const recommendedFoodsToShow = allRecommendedFoods.slice(0, visibleCount);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <>
      <Header />
      <SidebarLayout>
        <main className="px-4 py-5 pb-24 lg:pb-8 space-y-7 md:px-6 w-full overflow-hidden">
          <PromoBanner />

          <section>
            <CategoryPills />
          </section>

          <>
            {/* Hot & Sale */}
            {hotSaleFoods.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-extrabold flex items-center gap-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    🔥 Hot &amp; Sale
                  </h2>
                  <div className="flex items-center gap-2 md:hidden">
                    <button onClick={scrollLeft} className="neo-btn neo-btn-light w-8 h-8 flex items-center justify-center rounded-lg">
                      ←
                    </button>
                    <button onClick={scrollRight} className="neo-btn neo-btn-light w-8 h-8 flex items-center justify-center rounded-lg">
                      →
                    </button>
                  </div>
                  <span className="hidden md:block text-sm font-semibold cursor-pointer z-10" style={{ color: "var(--green-primary)" }}>
                    See all →
                  </span>
                </div>
                {/* Mobile: horizontal scroll */}
                <div
                  ref={scrollContainerRef}
                  className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 md:hidden max-w-[100vw]"
                >
                  {hotSaleFoods.map((food) => (
                    <FoodCard key={food.id} food={food} variant="hot" onClick={() => setSelectedFood(food)} />
                  ))}
                </div>
                {/* Tablet: grid */}
                <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {hotSaleFoods.map((food) => (
                    <FoodCard key={food.id} food={food} variant="grid" onClick={() => setSelectedFood(food)} />
                  ))}
                </div>
              </section>
            )}

            {/* Recommended for You */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold flex items-center gap-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  ⭐ Recommended for You
                </h2>
              </div>
              {/* Mobile: list */}
              <div className="space-y-3 md:hidden">
                {recommendedFoodsToShow.map((food) => (
                  <FoodCard key={food.id} food={food} variant="list" onClick={() => setSelectedFood(food)} />
                ))}
              </div>
              {/* Tablet: grid 2 cols */}
              <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-4">
                {recommendedFoodsToShow.map((food) => (
                  <FoodCard key={food.id} food={food} variant="grid" onClick={() => setSelectedFood(food)} />
                ))}
              </div>
              {/* Infinite Scroll target */}
              {visibleCount < allRecommendedFoods.length && (
                <div ref={observerTarget} className="py-6 flex justify-center w-full">
                  <div className="domino-dots">
                    <div /><div /><div />
                  </div>
                </div>
              )}
            </section>
          </>
        </main>
      </SidebarLayout>
      <FoodDetailPopup food={selectedFood} onClose={() => setSelectedFood(null)} />
    </>
  );
}
