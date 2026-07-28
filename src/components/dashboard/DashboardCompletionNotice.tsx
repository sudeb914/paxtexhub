"use client";

import { useDashboardSeller } from "@/components/dashboard/DashboardSellerContext";
import { ProfileCompletionAlert } from "@/components/dashboard/ProfileCompletionAlert";

export function DashboardCompletionNotice() {
  const seller = useDashboardSeller();
  if (seller.profileCompletion.isComplete) return null;
  return <div className="mb-6"><ProfileCompletionAlert completion={seller.profileCompletion} /></div>;
}
