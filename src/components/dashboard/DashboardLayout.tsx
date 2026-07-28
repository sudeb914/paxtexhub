"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import type { DashboardSeller } from "@/components/dashboard/ProfileCard";

export function DashboardLayout({ seller, children }: { seller: DashboardSeller; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  function toggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) setCompact((value) => !value);
    else setMobileOpen((value) => !value);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar compact={compact} onClose={() => setMobileOpen(false)} open={mobileOpen} />
      <Header compact={compact} onMenuClick={toggleSidebar} profileImage={seller.profileImage} username={seller.username} />
      <main className={`min-h-screen pt-[116px] transition-[padding-left] duration-300 ${compact ? "lg:pl-24" : "lg:pl-[342px]"}`}>
        <div className="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 sm:py-11 lg:px-[30px]">{children}</div>
      </main>
    </div>
  );
}
