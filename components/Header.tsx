"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
}

export default function Header({
  title,
  showBack = false,
  backHref = "/",
}: HeaderProps) {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 h-14"
      style={{
        background: "#fff",
        borderBottom: "2.5px solid #1a1a1a",
        boxShadow: "0 3px 0 #1a1a1a",
      }}
    >
      {/* Left: back or logo */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <Link
            href={backHref}
            className="neo-btn neo-btn-light w-9 h-9 text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-1.5">
            <span
              className="text-xl font-extrabold tracking-tight"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                color: "var(--green-primary)",
              }}
            >
              Poly<span style={{ color: "#1a1a1a" }}>Toon</span>
              <span style={{ color: "var(--green-primary)" }}>Food</span>
            </span>
          </Link>
        )}
      </div>

      {/* Center title (if given) */}
      {title && (
        <h1
          className="absolute left-1/2 -translate-x-1/2 text-lg font-bold"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {title}
        </h1>
      )}

      {/* Right: search + cart */}
      <div className="flex items-center gap-2">
        {/* <Link href="/search" className="neo-btn neo-btn-light w-9 h-9">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </Link> */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="neo-btn neo-btn-primary w-9 h-9 relative"
          aria-label="Open cart"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {totalItems > 0 && (
            <span
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white rounded-full"
              style={{
                background: "#e63946",
                border: "2px solid #1a1a1a",
              }}
            >
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
