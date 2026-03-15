"use client";

import Header from "@/components/Header";
import SidebarLayout from "@/components/SidebarLayout";
import { mockOrders } from "@/lib/api";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function OrdersPage() {
  const { isLoggedIn, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const cacheKey = `user_orders_${user.uid}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setOrders(JSON.parse(cached));
        setLoading(false);
      }

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      getDocs(q).then((querySnapshot) => {
        const fetchedOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.createdAt ? new Date(data.createdAt.toMillis()).toLocaleDateString() : "Just now"
          };
        });
        setOrders(fetchedOrders);
        sessionStorage.setItem(cacheKey, JSON.stringify(fetchedOrders));
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching orders", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!isLoggedIn) {
    return (
      <>
        <Header title="My Orders" />
        <SidebarLayout>
          <main className="px-4 py-5 pb-24 lg:pb-8 space-y-5 md:px-6 w-full max-w-2xl mx-auto text-center h-[60vh] flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Please Log In
            </h1>
            <p className="text-gray-500 mb-6">You need an account to view your order history.</p>
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
      <Header title="My Orders" />
      <SidebarLayout>
        <main className="px-4 py-5 pb-24 lg:pb-8 md:px-6 w-full max-w-3xl mx-auto space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="domino-dots">
                <div /><div /><div />
              </div>
              <p className="font-bold font-space text-gray-500">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div
              className="neo-card text-center py-14"
              style={{ background: "var(--green-light)" }}
            >
              <p className="text-5xl mb-3">📋</p>
              <p
                className="font-extrabold text-lg"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                No orders yet
              </p>
              <p className="text-sm text-gray-500 mt-1">Your order history will appear here</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="neo-card overflow-hidden">
                {/* Order header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: "2px solid #1a1a1a", background: "var(--green-light)" }}
                >
                  <div>
                    <p
                      className="font-extrabold text-sm"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {order.id}
                    </p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <span
                    className="neo-badge text-xs"
                    style={{
                      background: order.status === "delivered" ? "var(--green-primary)" : "#f59e0b",
                      color: "#fff",
                    }}
                  >
                    {order.status === "delivered" ? "✓ Delivered" : order.status}
                  </span>
                </div>
                {/* Items */}
                <div className="divide-y divide-gray-100">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <div
                        className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl rounded-lg overflow-hidden relative"
                        style={{ background: "var(--green-light)", border: "2px solid #1a1a1a" }}
                      >
                        {item.food.image.startsWith('http') ? (
                          <Image src={item.food.image} alt={item.food.name} width={48} height={48} className="w-full h-full object-cover" unoptimized />
                        ) : (
                          item.food.image
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold text-sm truncate"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {item.food.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Size {item.selectedSize} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-sm flex-shrink-0" style={{ color: "var(--green-primary)" }}>
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Total */}
                <div
                  className="flex justify-between items-center px-4 py-3"
                  style={{ borderTop: "2px solid #1a1a1a", background: "#fafafa" }}
                >
                  <span className="font-semibold text-sm">Total</span>
                  <span
                    className="font-extrabold text-lg"
                    style={{ color: "var(--green-primary)", fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </main>
      </SidebarLayout>
    </>
  );
}
