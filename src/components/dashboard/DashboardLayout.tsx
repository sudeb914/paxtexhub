"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import type { DashboardSeller } from "@/components/dashboard/ProfileCard";
import type { AuthenticatedUser } from "@/types/auth";

export function DashboardLayout({ seller, children }: { seller: DashboardSeller; children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [headerName, setHeaderName] = useState(seller.username);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store", signal: controller.signal });
        if (response.status === 401) {
          router.replace("/login");
          router.refresh();
          return;
        }
        if (!response.ok) return;
        const body = await response.json() as { user?: AuthenticatedUser };
        const displayName = body.user?.displayName.trim();
        if (displayName) setHeaderName(displayName);
      } catch {
        // Keep the existing seller name when the request is interrupted or unavailable.
      }
    }
    void loadCurrentUser();
    return () => controller.abort();
  }, [router]);

  function toggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) setCompact((value) => !value);
    else setMobileOpen((value) => !value);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar compact={compact} onClose={() => setMobileOpen(false)} open={mobileOpen} />
      <Header compact={compact} onMenuClick={toggleSidebar} profileImage={seller.profileImage} username={headerName} />
      <main className={`min-h-screen pt-[116px] transition-[padding-left] duration-300 ${compact ? "lg:pl-24" : "lg:pl-[342px]"}`}>
        <div className="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 sm:py-11 lg:px-[30px]">{children}</div>
      </main>
    </div>
  );
}
