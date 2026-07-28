import Link from "next/link";
import { Mail, Pencil, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/dashboard/Avatar";

export interface DashboardSeller {
  displayName: string;
  role: string;
  email?: string | null;
  profileImage?: string | null;
}

export function ProfileCard({ seller }: { seller: DashboardSeller }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-5 text-center sm:flex-row sm:gap-7 sm:text-left lg:min-w-[405px]">
      <Avatar name={seller.displayName} profileImage={seller.profileImage} size="large" />
      <div className="w-full min-w-0 sm:w-auto sm:flex-1">
        <h2 className="break-words text-[21px] font-bold tracking-[-0.02em] text-[#0b1426] sm:text-[22px]">{seller.displayName}</h2>
        <p className="mt-2 flex items-center justify-center gap-2 text-[15px] text-[#52627a] sm:justify-start sm:text-[16px]"><ShieldCheck className="size-5 shrink-0 text-[#0864ff]" />{seller.role}</p>
        <p className="mt-2 flex min-w-0 items-start justify-center gap-2 text-[14px] text-[#52627a] sm:justify-start sm:text-[16px]"><Mail className="mt-0.5 size-5 shrink-0" /><span className="min-w-0 break-all">{seller.email || "No email added"}</span></p>
        <Link className="mt-5 inline-flex h-12 items-center gap-3 rounded-lg bg-[#f1f3f7] px-5 text-[16px] font-semibold text-[#172236] transition hover:bg-[#e8ebf0]" href="/dashboard/profile"><Pencil className="size-5 text-[#53657c]" />Edit Profile</Link>
      </div>
    </div>
  );
}
