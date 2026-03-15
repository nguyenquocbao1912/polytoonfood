"use client";

import TabletSideNav from "./TabletSideNav";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:flex min-h-[calc(100vh-3.5rem)] w-full items-start">
      {/* Tablet sidebar */}
      <aside
        className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0 p-5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
        style={{ borderRight: "2.5px solid #1a1a1a" }}
      >
        <TabletSideNav />
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 min-w-0 max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
