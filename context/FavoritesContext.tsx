"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { FoodItem } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface FavoritesContextType {
  favorites: FoodItem[];
  loading: boolean;
  toggleFavorite: (food: FoodItem) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FoodItem[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const docRef = doc(db, "user_favorites", user.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setFavorites(docSnap.data().foods || []);
        } else {
          setFavorites([]);
        }
        setLoading(false);
      }).catch((err) => {
        console.error("Error fetching favorites", err);
        setLoading(false);
      });
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const toggleFavorite = useCallback((food: FoodItem) => {
    setFavorites((prev) => {
      const isFav = prev.find((f) => f.id === food.id);
      const newFavorites = isFav ? prev.filter((f) => f.id !== food.id) : [...prev, food];
      
      // Sync to Firebase if logged in
      if (user) {
        setDoc(doc(db, "user_favorites", user.uid), { foods: newFavorites }).catch(err => {
          console.error("Error saving favorite to Firebase", err);
        });
      }
      return newFavorites;
    });
  }, [user]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
