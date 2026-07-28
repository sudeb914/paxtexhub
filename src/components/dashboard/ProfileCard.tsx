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
    <div className="flex items-center gap-7 lg:min-w-[405px]">
      <Avatar name={seller.displayName} profileImage={seller.profileImage} size="large" />
      <div className="min-w-0">
        <h2 className="truncate text-[22px] font-bold tracking-[-0.02em] text-[#0b1426]">{seller.displayName}</h2>
        <p className="mt-2 flex items-center gap-2 text-[16px] text-[#52627a]"><ShieldCheck className="size-5 text-[#0864ff]" />{seller.role}</p>
        <p className="mt-2 flex items-center gap-2 text-[16px] text-[#52627a]"><Mail className="size-5" />{seller.email || "No email added"}</p>
        <Link className="mt-5 inline-flex h-12 items-center gap-3 rounded-lg bg-[#f1f3f7] px-5 text-[16px] font-semibold text-[#172236] transition hover:bg-[#e8ebf0]" href="/dashboard/profile"><Pencil className="size-5 text-[#53657c]" />Edit Profile</Link>
      </div>
    </div>
  );
}
