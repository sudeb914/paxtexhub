import { ChartNoAxesColumnIncreasing } from "lucide-react";

export function DashboardCard() {
  return (
    <section className="mt-6 min-h-[420px] min-w-0 rounded-[18px] border border-[#e8ebef] bg-white px-5 py-6 shadow-[0_5px_18px_rgba(20,31,50,.055)] sm:mt-9 sm:min-h-[515px] sm:px-9 sm:py-8">
      <h2 className="text-[23px] font-bold tracking-[-0.035em] text-[#0b1426] sm:text-[26px]">Dashboard</h2>
      <div className="flex min-h-[320px] flex-col items-center justify-center pb-5 text-center sm:min-h-[390px] sm:pb-9">
        <div className="grid size-[96px] place-items-center rounded-full bg-[#f0f5ff] sm:size-[114px]"><ChartNoAxesColumnIncreasing className="size-10 stroke-[1.8] text-[#0864ff] sm:size-12" aria-hidden="true" /></div>
        <h3 className="mt-6 text-[22px] font-bold tracking-[-0.025em] text-[#081226] sm:mt-7 sm:text-[25px]">You&apos;re all set!</h3>
        <p className="mt-4 max-w-[520px] text-[15px] leading-7 text-[#53647e] sm:mt-5 sm:text-[18px] sm:leading-8">Use the menu on the left to manage your listings,<br className="hidden sm:block" /> add new cars, and grow your business.</p>
      </div>
    </section>
  );
}
