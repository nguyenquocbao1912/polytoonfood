"use client";

import Header from "@/components/Header";
import SidebarLayout from "@/components/SidebarLayout";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <>
        <Header title="My Profile" />
        <SidebarLayout>
          <main className="px-4 py-5 pb-24 lg:pb-8 space-y-5 md:px-6 w-full max-w-2xl mx-auto text-center h-[60vh] flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">👤</div>
            <h1 className="text-2xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Please Log In
            </h1>
            <p className="text-gray-500 mb-6">You need an account to view and edit your profile.</p>
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
      <Header title="My Profile" />
      <SidebarLayout>
        <main className="px-4 py-5 pb-24 lg:pb-8 space-y-5 md:px-6 w-full max-w-2xl mx-auto">
          {/* User Info Card */}
          <div
            className="neo-card p-5 flex items-center gap-4"
            style={{ background: "var(--green-light)" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white relative flex-shrink-0"
              style={{ background: "var(--green-primary)", border: "2.5px solid #1a1a1a" }}
            >
              👩‍🍳
              <div
                className="absolute -bottom-2 -right-2 w-7 h-7 flex items-center justify-center rounded-lg bg-white"
                style={{ border: "2px solid #1a1a1a" }}
              >
                ✏️
              </div>
            </div>
            <div>
              <h1
                className="text-xl font-extrabold line-clamp-1"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {user?.displayName || "PolyToon Chef"}
              </h1>
              <p className="text-sm font-semibold text-gray-600 mt-1">{user?.email || "@polychef_32"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="neo-badge text-xs px-2 py-0.5"
                  style={{ background: "#f59e0b", color: "#fff" }}
                >
                  ⭐ Gold Member
                </span>
                <span className="text-xs font-bold" style={{ color: "var(--green-primary)" }}>
                  250 pts
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="neo-card p-4 text-center">
              <p className="text-2xl font-extrabold mb-1" style={{ color: "var(--green-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
                12
              </p>
              <p className="text-xs font-bold text-gray-500">Orders</p>
            </div>
            <div className="neo-card p-4 text-center">
              <p className="text-2xl font-extrabold mb-1" style={{ color: "var(--green-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
                $184
              </p>
              <p className="text-xs font-bold text-gray-500">Saved</p>
            </div>
          </div>

          {/* Menu Options */}
          <div className="space-y-3">
            <p className="font-extrabold px-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Account Settings
            </p>

            <ProfileMenuItem icon="📍" label="Delivery Addresses" />
            <ProfileMenuItem icon="💳" label="Payment Methods" />
            <ProfileMenuItem icon="🔔" label="Notifications" />
            <ProfileMenuItem icon="🛡️" label="Privacy & Security" />
            
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="w-full text-left flex items-center gap-3 p-4 rounded-2xl font-bold bg-white active:translate-y-0.5 active:shadow-none transition-all mt-4"
              style={{
                border: "2px solid #1a1a1a",
                boxShadow: "3px 3px 0 #1a1a1a",
                color: "#e63946",
              }}
            >
              <span className="text-xl w-8 text-center">🚪</span>
              Log Out
            </button>
          </div>
        </main>
      </SidebarLayout>
    </>
  );
}

function ProfileMenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      className="w-full text-left flex items-center justify-between p-4 rounded-2xl font-bold bg-white active:translate-y-0.5 active:shadow-none transition-all"
      style={{
        border: "2px solid #1a1a1a",
        boxShadow: "3px 3px 0 #1a1a1a",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl w-8 text-center">{icon}</span>
        {label}
      </div>
      <span className="text-gray-400">→</span>
    </button>
  );
}
