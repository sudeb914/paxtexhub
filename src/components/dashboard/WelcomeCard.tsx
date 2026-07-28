"use client";

import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { useDashboardSeller } from "@/components/dashboard/DashboardSellerContext";

export function WelcomeCard() {
  const seller = useDashboardSeller();
  return (
    <section className="grid min-w-0 overflow-hidden rounded-[18px] border border-[#e8ebef] bg-white px-5 py-6 shadow-[0_5px_18px_rgba(20,31,50,.06)] sm:min-h-[255px] sm:px-10 sm:py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-[50px]">
      <div className="min-w-0 pr-0 lg:pr-12">
        <h1 className="break-words text-[24px] font-bold leading-[1.2] tracking-[-0.035em] text-[#081226] sm:text-[32px]">Welcome back, {seller.displayName}! Ready to make some moves? <span aria-hidden="true">🚀</span></h1>
        <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[#53647e] sm:mt-5 sm:text-[17px] sm:leading-[1.55]">Your next great sale starts here. Manage your listings, connect with buyers, and keep your showroom moving.</p>
      </div>
      <div className="mt-6 min-w-0 border-t border-[#e3e7ed] pt-6 sm:mt-8 sm:pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-[42px] lg:pt-0"><ProfileCard seller={seller} /></div>
    </section>
  );
}
