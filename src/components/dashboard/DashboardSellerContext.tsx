"use client";

import { createContext, useContext } from "react";
import type { DashboardSeller } from "@/components/dashboard/ProfileCard";

const DashboardSellerContext = createContext<DashboardSeller | null>(null);

export function DashboardSellerProvider({ seller, children }: { seller: DashboardSeller; children: React.ReactNode }) {
  return <DashboardSellerContext.Provider value={seller}>{children}</DashboardSellerContext.Provider>;
}

export function useDashboardSeller() {
  const seller = useContext(DashboardSellerContext);
  if (!seller) throw new Error("useDashboardSeller must be used inside DashboardSellerProvider");
  return seller;
}
