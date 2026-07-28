"use client";

import { useState } from "react";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { Avatar } from "@/components/dashboard/Avatar";
import { useLogout } from "@/hooks/use-logout";

export function Header({ displayName, profileImage, compact, onMenuClick }: { displayName: string; profileImage?: string | null; compact: boolean; onMenuClick: () => void }) {
  const [open, setOpen] = useState(false);
  const { isLoggingOut, logoutError, logout } = useLogout();
  return (
    <header className={`fixed left-0 right-0 top-0 z-30 flex h-[96px] min-w-0 items-center border-b border-[#edf0f4] bg-white px-4 transition-[left] duration-300 sm:h-[116px] sm:px-10 ${compact ? "lg:left-24" : "lg:left-[342px]"}`}>
      <button aria-label="Toggle sidebar" className="grid size-11 place-items-center rounded-lg text-[#283a55] transition hover:bg-slate-50" onClick={onMenuClick} type="button"><Menu className="size-7 stroke-[1.7]" /></button>
      <div className="relative ml-auto">
        <button aria-expanded={open} aria-haspopup="menu" className="flex items-center gap-4 rounded-xl px-2 py-2 transition hover:bg-slate-50" onClick={() => setOpen((value) => !value)} type="button">
          <Avatar name={displayName} profileImage={profileImage} />
          <span className="hidden text-[17px] font-semibold text-[#0b1426] sm:block">{displayName}</span>
          <ChevronDown className={`hidden size-[18px] text-[#43536b] transition-transform sm:block ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        {open ? <div className="absolute right-0 top-[calc(100%+8px)] min-w-52 rounded-xl border border-[#e5e9ef] bg-white p-2 shadow-[0_10px_30px_rgba(20,31,50,.12)]" role="menu"><button className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-[#24334a] transition hover:bg-slate-50 disabled:opacity-60" disabled={isLoggingOut} onClick={() => void logout()} role="menuitem" type="button"><LogOut className="size-5" />{isLoggingOut ? "Logging out..." : "Logout"}</button>{logoutError ? <p className="px-3 py-2 text-xs text-red-600" role="alert">{logoutError}</p> : null}</div> : null}
      </div>
    </header>
  );
}
