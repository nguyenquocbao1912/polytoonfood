"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, FoodItem } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (food: FoodItem, size: "S" | "M" | "L", qty?: number) => void;
  removeItem: (foodId: string, size: "S" | "M" | "L") => void;
  updateQty: (foodId: string, size: "S" | "M" | "L", qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback(
    (food: FoodItem, size: "S" | "M" | "L", qty = 1) => {
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.food.id === food.id && i.selectedSize === size
        );
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
          return updated;
        }
        return [...prev, { food, quantity: qty, selectedSize: size }];
      });
    },
    []
  );

  const removeItem = useCallback((foodId: string, size: "S" | "M" | "L") => {
    setItems((prev) =>
      prev.filter((i) => !(i.food.id === foodId && i.selectedSize === size))
    );
  }, []);

  const updateQty = useCallback(
    (foodId: string, size: "S" | "M" | "L", qty: number) => {
      if (qty <= 0) {
        removeItem(foodId, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.food.id === foodId && i.selectedSize === size
            ? { ...i, quantity: qty }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.food.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
