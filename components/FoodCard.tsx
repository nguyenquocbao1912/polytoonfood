"use client";

import Image from "next/image";
import { FoodItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import StarRating from "./StarRating";

interface FoodCardProps {
  food: FoodItem;
  variant?: "grid" | "list" | "hot";
  onClick?: () => void;
}

/** Returns true when the image field is a real URL (not an emoji) */
function isUrl(src: string) {
  return src.startsWith("http");
}

function FoodImage({
  src,
  alt,
  fill = false,
  size = 64,
  className = "",
}: {
  src: string;
  alt: string;
  fill?: boolean;
  size?: number;
  className?: string;
}) {
  if (isUrl(src)) {
    return fill ? (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 300px"
        className={`object-cover ${className}`}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        unoptimized
      />
    ) : (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`object-cover rounded-lg ${className}`}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        unoptimized
      />
    );
  }
  return (
    <span
      className={`flex items-center justify-center ${className}`}
      style={{ fontSize: fill ? "3.5rem" : `${size * 0.6}px` }}
    >
      {src}
    </span>
  );
}

export default function FoodCard({ food, variant = "grid", onClick }: FoodCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(food.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(food, food.sizes[0]);
  };
  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(food);
  };

  // ── hot variant (compact horizontal card) ───────────────────────────────
  if (variant === "hot") {
    return (
      <div
        className="w-40 neo-card relative cursor-pointer flex-shrink-0 overflow-hidden"
        style={{ background: "var(--green-light)" }}
        onClick={onClick}
      >
        {food.discount && (
          <div
            className="absolute top-2 left-2 neo-badge z-10"
            style={{ background: "#e63946", color: "#fff" }}
          >
            -{food.discount}%
          </div>
        )}
        <button
          onClick={handleFav}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full"
          style={{ background: "#fff", border: "2px solid #1a1a1a" }}
        >
          <HeartIcon filled={fav} />
        </button>
        <div
          className="h-24 relative flex items-center justify-center"
          style={{ borderBottom: "2px solid #1a1a1a" }}
        >
          {isUrl(food.image) ? (
            <Image
              src={food.image}
              alt={food.name}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              unoptimized
            />
          ) : (
            <span className="text-5xl">{food.image}</span>
          )}
        </div>
        <div className="p-2">
          <p className="font-bold text-sm leading-tight line-clamp-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            {food.name}
          </p>
          <p className="text-sm font-bold mt-0.5" style={{ color: "var(--green-primary)" }}>
            ${food.price}
          </p>
        </div>
      </div>
    );
  }

  // ── grid variant ─────────────────────────────────────────────────────────
  if (variant === "grid") {
    return (
      <div
        className="neo-card relative cursor-pointer overflow-hidden flex flex-col"
        style={{ background: "var(--green-light)" }}
        onClick={onClick}
      >
        {food.discount && (
          <div
            className="absolute top-2 left-2 neo-badge z-10"
            style={{ background: "#e63946", color: "#fff" }}
          >
            -{food.discount}%
          </div>
        )}
        <button
          onClick={handleFav}
          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-lg"
          style={{ background: "#fff", border: "2px solid #1a1a1a" }}
        >
          <HeartIcon filled={fav} />
        </button>
        <div
          className="h-64 md:h-72 relative flex items-center justify-center flex-shrink-0"
          style={{ borderBottom: "2px solid #1a1a1a" }}
        >
          {isUrl(food.image) ? (
            <Image
              src={food.image}
              alt={food.name}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              unoptimized
            />
          ) : (
            <span className="text-6xl">{food.image}</span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="font-bold text-sm leading-tight line-clamp-2 mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            {food.name}
          </p>
          <p className="font-bold text-base" style={{ color: "var(--green-primary)" }}>
            ${food.price}
          </p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <StarRating rating={food.rating} size={12} />
            <button
              onClick={handleQuickAdd}
              className="neo-btn neo-btn-primary text-xs px-3 py-1"
              style={{ borderRadius: "8px", boxShadow: "2px 2px 0 #1a1a1a" }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── list variant ─────────────────────────────────────────────────────────
  return (
    <div
      className="neo-card flex items-center gap-3 p-3 cursor-pointer"
      onClick={onClick}
    >
      <div
        className="w-16 h-16 flex-shrink-0 relative overflow-hidden rounded-xl"
        style={{ background: "var(--green-light)", border: "2px solid #1a1a1a" }}
      >
        {isUrl(food.image) ? (
          <Image src={food.image} alt={food.name} fill className="object-cover" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" unoptimized />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-3xl">{food.image}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-tight truncate" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          {food.name}
        </p>
        <StarRating rating={food.rating} size={12} />
        <p className="font-bold text-base mt-0.5" style={{ color: "var(--green-primary)" }}>
          ${food.price}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button onClick={handleFav}>
          <HeartIcon filled={fav} />
        </button>
        <button
          onClick={handleQuickAdd}
          className="neo-btn neo-btn-primary text-xs px-3 py-1.5"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#e63946" : "none"} stroke={filled ? "#e63946" : "#888"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
