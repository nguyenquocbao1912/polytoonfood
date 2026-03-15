"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabletSideNav() {
    const pathname = usePathname();
    const isHomeActive = pathname === "/" || !["/search", "/orders", "/favorites", "/profile"].some(p => pathname.startsWith(p));
    return (
        <>
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-lg"
                style={{ 
                    background: isHomeActive ? "var(--green-primary)" : "transparent", 
                    color: isHomeActive ? "#fff" : "#1a1a1a", 
                    border: isHomeActive ? "2px solid #1a1a1a" : "2px solid transparent", 
                    boxShadow: isHomeActive ? "2px 2px 0 #1a1a1a" : "none", 
                    fontFamily: "Space Grotesk, sans-serif" 
                }}>
                <span>🏠</span> Home
            </Link>
            {[
                { href: "/search", label: "Search", icon: "🔍" },
                { href: "/orders", label: "Orders", icon: "📋" },
                { href: "/favorites", label: "Favorites", icon: "❤️" },
                { href: "/profile", label: "Profile", icon: "👤" },
            ].map(({ href, label, icon }) => {
                const active = pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-lg transition-colors"
                        style={{ 
                            background: active ? "var(--green-primary)" : "transparent",
                            color: active ? "#fff" : "#1a1a1a",
                            border: active ? "2px solid #1a1a1a" : "2px solid transparent", 
                            boxShadow: active ? "2px 2px 0 #1a1a1a" : "none",
                            fontFamily: "Space Grotesk, sans-serif" 
                        }}
                    >
                        <span>{icon}</span> {label}
                    </Link>
                );
            })}
        </>
    );
}