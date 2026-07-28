"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, CircleUserRound, LayoutGrid, LogOut, Mail, PlusSquare, Settings, X } from "lucide-react";
import { MenuItem } from "@/components/dashboard/MenuItem";
import { useLogout } from "@/hooks/use-logout";

const primaryItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "My Listings", href: "/dashboard/listings", icon: CarFront },
  { label: "Add Listing", href: "/dashboard/add-listing", icon: PlusSquare },
  { label: "Messages", href: "/dashboard/messages", icon: Mail },
];

const accountItems = [
  { label: "Profile", href: "/dashboard/profile", icon: CircleUserRound },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ open, compact, onClose }: { open: boolean; compact: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { isLoggingOut, logoutError, logout } = useLogout();
  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <button aria-label="Close sidebar" className={`fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[1px] transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} type="button" />
      <aside className={`fixed inset-y-0 left-0 z-50 flex border-r border-[#edf0f4] bg-white transition-[width,transform] duration-300 ${compact ? "lg:w-24" : "lg:w-[342px]"} w-[300px] ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-[18px] py-8 lg:py-[48px]">
          <div className={`flex items-center ${compact ? "justify-center" : "px-3"}`}>
            <Link aria-label="AutoHub dashboard" className="flex items-center gap-4" href="/dashboard">
              <CarFront className="size-12 shrink-0 stroke-[1.7] text-[#0864ff]" aria-hidden="true" />
              {!compact ? <div><p className="text-[29px] font-bold leading-none tracking-[-0.04em] text-[#0b1426]">AutoHub</p><p className="mt-2 text-[16px] text-[#52627a]">Seller Dashboard</p></div> : null}
            </Link>
            <button aria-label="Close navigation" className="ml-auto grid size-10 place-items-center text-slate-600 lg:hidden" onClick={onClose} type="button"><X /></button>
          </div>

          <nav aria-label="Seller dashboard" className="mt-[62px] space-y-3">
            {primaryItems.map((item) => <MenuItem active={isActive(item.href)} compact={compact} key={item.href} onNavigate={onClose} {...item} />)}
            <div className="my-4 h-px bg-[#e5e9ef]" />
            {accountItems.map((item) => <MenuItem active={isActive(item.href)} compact={compact} key={item.href} onNavigate={onClose} {...item} />)}
          </nav>

          <div className="mt-auto border-t border-[#e5e9ef] pt-5">
            <button aria-label={compact ? "Logout" : undefined} className={`flex h-[58px] w-full items-center rounded-xl text-[#24334a] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "justify-center" : "gap-6 px-5"}`} disabled={isLoggingOut} onClick={() => void logout()} title={compact ? "Logout" : undefined} type="button"><LogOut className="size-[26px] stroke-[1.8]" />{!compact ? <span className="text-[17px] font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span> : null}</button>
            {logoutError && !compact ? <p className="px-5 text-xs text-red-600" role="alert">{logoutError}</p> : null}
          </div>
        </div>
      </aside>
    </>
  );
}
