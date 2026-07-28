import { CarFront } from "lucide-react";

export function SitePreloader() {
  return (
    <div aria-label="Loading AutoHub" aria-live="polite" className="autohub-preloader fixed inset-0 z-[9999] grid min-h-[100dvh] place-items-center overflow-hidden bg-[#f7f9fc] px-6" role="status">
      <div aria-hidden="true" className="absolute -left-24 -top-24 size-72 rounded-full bg-blue-100/70 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-32 -right-20 size-80 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="relative flex w-full max-w-[310px] flex-col items-center text-center">
        <div className="relative grid size-[92px] place-items-center">
          <span aria-hidden="true" className="autohub-loader-ring absolute inset-0 rounded-full border border-[#0864ff]/20" />
          <span aria-hidden="true" className="autohub-loader-ring autohub-loader-ring-delay absolute inset-[9px] rounded-full border border-[#38bdf8]/25" />
          <div className="autohub-loader-car relative grid size-16 place-items-center rounded-2xl bg-[#07111f] text-white shadow-[0_14px_34px_rgba(7,17,31,.22)]">
            <CarFront className="size-8 stroke-[1.8] text-[#4d91ff]" />
            <span aria-hidden="true" className="absolute bottom-[13px] left-[17px] size-1.5 rounded-full bg-white" />
            <span aria-hidden="true" className="absolute bottom-[13px] right-[17px] size-1.5 rounded-full bg-white" />
          </div>
        </div>
        <div className="mt-5 flex items-center gap-1 text-[22px] font-bold tracking-[-.04em] text-[#07111f]"><span className="text-[#0864ff]">Auto</span>Hub<span className="text-[#0864ff]">.</span></div>
        <p className="mt-2 text-sm font-medium text-[#627189]">Finding the right ride for you</p>
        <div aria-hidden="true" className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-[#e5ebf3]"><span className="autohub-loader-progress block h-full w-[42%] rounded-full bg-[linear-gradient(90deg,#0864ff,#38bdf8,#4f46e5)]" /></div>
        <div aria-hidden="true" className="mt-4 flex gap-1.5"><span className="autohub-loader-dot size-1.5 rounded-full bg-[#0864ff]" /><span className="autohub-loader-dot autohub-loader-dot-delay-1 size-1.5 rounded-full bg-[#0864ff]" /><span className="autohub-loader-dot autohub-loader-dot-delay-2 size-1.5 rounded-full bg-[#0864ff]" /></div>
        <span className="sr-only">Please wait while AutoHub loads.</span>
      </div>
    </div>
  );
}
