"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FoodCard from "@/components/FoodCard";
import FoodDetailPopup from "@/components/FoodDetailPopup";
import SidebarLayout from "@/components/SidebarLayout";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FoodItem } from "@/lib/types";

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites();
  const { isLoggedIn, user } = useAuth();
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  if (!isLoggedIn) {
    return (
      <>
        <Header title="My Favorites" />
        <SidebarLayout>
          <main className="px-4 py-5 pb-24 lg:pb-8 space-y-5 md:px-6 w-full max-w-2xl mx-auto text-center h-[60vh] flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Please Log In
            </h1>
            <p className="text-gray-500 mb-6">You need an account to view and save your favorite foods.</p>
            <Link href="/login" className="neo-btn neo-btn-primary px-8 h-12 text-lg">
              Log In
            </Link>
          </main>
        </SidebarLayout>
      </>
    );
  }

  return (
    <>
      <Header title="My Favorites" />
      <SidebarLayout>
        <main className="flex-1 min-w-0 px-4 py-5 pb-24 lg:pb-8 md:px-6 space-y-5 w-full max-w-6xl mx-auto">
          {/* Count badge */}
          <div className="flex items-center gap-3">
            <span
              className="neo-badge text-sm px-4 py-2"
              style={{ background: "#e63946", color: "#fff", borderColor: "#1a1a1a" }}
            >
              ❤️ {favorites.length} saved
            </span>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="domino-dots">
                <div /><div /><div />
              </div>
              <p className="font-bold font-space text-gray-500">Loading favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div
              className="neo-card text-center py-16"
              style={{ background: "var(--green-light)" }}
            >
              <p className="text-6xl mb-4">❤️</p>
              <h2
                className="text-xl font-extrabold"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                No favorites yet
              </h2>
              <p className="text-sm text-gray-500 mt-2 mb-4">
                Tap the heart on any food to save it here
              </p>
              <a
                href="/"
                className="neo-btn neo-btn-primary px-6 py-2.5 text-sm"
                style={{ display: "inline-flex" }}
              >
                Browse Food
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {favorites.map((food) => (
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
