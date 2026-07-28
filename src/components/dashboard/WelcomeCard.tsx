"use client";

import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { useDashboardSeller } from "@/components/dashboard/DashboardSellerContext";

export function WelcomeCard() {
  const seller = useDashboardSeller();
  return (
    <section className="grid min-h-[255px] items-center rounded-[18px] border border-[#e8ebef] bg-white px-7 py-8 shadow-[0_5px_18px_rgba(20,31,50,.06)] sm:px-10 lg:grid-cols-[1fr_auto] lg:px-[50px]">
      <div className="pr-0 lg:pr-12">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.035em] text-[#081226] sm:text-[32px]">Welcome back, {seller.displayName}! Ready to make some moves? <span aria-hidden="true">🚀</span></h1>
        <p className="mt-5 max-w-[620px] text-[17px] leading-[1.55] text-[#53647e]">Your next great sale starts here. Manage your listings, connect with buyers, and keep your showroom moving.</p>
      </div>
      <div className="mt-8 border-t border-[#e3e7ed] pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-[42px] lg:pt-0"><ProfileCard seller={seller} /></div>
    </section>
  );
}
