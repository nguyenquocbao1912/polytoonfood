import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import CartPopup from "@/components/CartPopup";

export const metadata: Metadata = {
  title: "PolyToonFood – Order Delicious Food",
  description: "PolyToonFood – Fresh, fast and fun food delivery app. Order pizza, burgers, sushi and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className="max-w-2xl mx-auto relative md:max-w-none">
                {children}
                <CartPopup />
                <BottomNav />
              </div>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
