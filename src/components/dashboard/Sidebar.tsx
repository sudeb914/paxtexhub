"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const { isLoggingOut, logoutError, logout } = useLogout();
  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  useEffect(() => {
    if (!showLogoutConfirmation) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoggingOut) setShowLogoutConfirmation(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [showLogoutConfirmation, isLoggingOut]);

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
            <button aria-label={compact ? "Logout" : undefined} className={`flex h-[58px] w-full items-center rounded-xl text-[#24334a] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "justify-center" : "gap-6 px-5"}`} disabled={isLoggingOut} onClick={() => setShowLogoutConfirmation(true)} title={compact ? "Logout" : undefined} type="button"><LogOut className="size-[26px] stroke-[1.8]" />{!compact ? <span className="text-[17px] font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span> : null}</button>
            {logoutError && !compact ? <p className="px-5 text-xs text-red-600" role="alert">{logoutError}</p> : null}
          </div>
        </div>
      </aside>
      {showLogoutConfirmation ? <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/40 px-5 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget && !isLoggingOut) setShowLogoutConfirmation(false); }} role="presentation">
        <div aria-labelledby="sidebar-logout-title" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="dialog">
          <div className="flex items-start justify-between"><div className="grid size-11 place-items-center rounded-full bg-blue-50 text-[#0864ff]"><LogOut className="size-5" /></div><button aria-label="Close logout confirmation" className="grid size-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100" disabled={isLoggingOut} onClick={() => setShowLogoutConfirmation(false)} type="button"><X className="size-5" /></button></div>
          <h2 className="mt-5 text-xl font-bold text-[#0b1426]" id="sidebar-logout-title">Are you sure you want to log out?</h2>
          <p className="mt-2 text-sm leading-6 text-[#627189]">You will need to sign in again to access your seller dashboard.</p>
          {logoutError ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{logoutError}</p> : null}
          <div className="mt-6 flex justify-end gap-3"><button className="h-10 rounded-lg border border-[#dfe4eb] px-4 text-sm font-semibold text-[#33445c] transition hover:bg-slate-50" disabled={isLoggingOut} onClick={() => setShowLogoutConfirmation(false)} type="button">Cancel</button><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0864ff] px-4 text-sm font-semibold text-white transition hover:bg-[#0757dc] disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoggingOut} onClick={() => void logout()} type="button"><LogOut className="size-4" />{isLoggingOut ? "Logging out..." : "Yes, Log Out"}</button></div>
        </div>
      </div> : null}
    </>
  );
}
