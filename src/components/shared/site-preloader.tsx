import { CarFront } from "lucide-react";

export function SitePreloader() {
  return (
    <div aria-label="Loading AutoHub" aria-live="polite" className="fixed inset-0 z-[9999] grid min-h-[100dvh] place-items-center overflow-hidden bg-white px-6" role="status">
      <div className="flex flex-col items-center text-center">
        <div aria-hidden="true" className="autohub-cube-scene">
          <div className="autohub-cube">
            <span className="autohub-cube-face autohub-cube-front"><CarFront className="size-7 stroke-[1.7] text-white/90" /></span>
            <span className="autohub-cube-face autohub-cube-back" />
            <span className="autohub-cube-face autohub-cube-right" />
            <span className="autohub-cube-face autohub-cube-left" />
            <span className="autohub-cube-face autohub-cube-top" />
            <span className="autohub-cube-face autohub-cube-bottom" />
          </div>
          <span className="autohub-cube-shadow" />
        </div>
        <div className="mt-9 flex items-center gap-1 text-[21px] font-bold tracking-[-.045em] text-[#07111f]"><span className="text-[#0864ff]">Auto</span>Hub<span className="text-[#0864ff]">.</span></div>
        <p className="mt-2 text-xs font-medium uppercase tracking-[.16em] text-[#8290a3]">Loading marketplace</p>
        <span className="sr-only">Please wait while AutoHub loads.</span>
      </div>
    </div>
  );
}
