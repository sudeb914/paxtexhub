import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function MenuItem({ href, icon: Icon, label, active, compact = false, onNavigate, badge }: { href: string; icon: LucideIcon; label: string; active: boolean; compact?: boolean; onNavigate?: () => void; badge?: React.ReactNode }) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      aria-label={compact ? label : undefined}
      className={`relative flex h-[66px] items-center rounded-xl transition-colors ${compact ? "justify-center px-0" : "gap-6 px-5"} ${active ? "bg-blue-50 text-[#075ee8]" : "text-[#13223a] hover:bg-slate-50"}`}
      href={href}
      onClick={onNavigate}
      title={compact ? label : undefined}
    >
      <Icon aria-hidden="true" className="size-[26px] shrink-0 stroke-[1.8]" />
      {!compact ? <span className="text-[17px] font-medium">{label}</span> : null}
      {badge}
    </Link>
  );
}
