import { ChartNoAxesColumnIncreasing } from "lucide-react";

export function DashboardCard() {
  return (
    <section className="mt-9 min-h-[515px] rounded-[18px] border border-[#e8ebef] bg-white px-7 py-8 shadow-[0_5px_18px_rgba(20,31,50,.055)] sm:px-9">
      <h2 className="text-[26px] font-bold tracking-[-0.035em] text-[#0b1426]">Dashboard</h2>
      <div className="flex min-h-[390px] flex-col items-center justify-center pb-9 text-center">
        <div className="grid size-[114px] place-items-center rounded-full bg-[#f0f5ff]"><ChartNoAxesColumnIncreasing className="size-12 stroke-[1.8] text-[#0864ff]" aria-hidden="true" /></div>
        <h3 className="mt-7 text-[25px] font-bold tracking-[-0.025em] text-[#081226]">You&apos;re all set!</h3>
        <p className="mt-5 max-w-[520px] text-[18px] leading-8 text-[#53647e]">Use the menu on the left to manage your listings,<br className="hidden sm:block" /> add new cars, and grow your business.</p>
      </div>
    </section>
  );
}
