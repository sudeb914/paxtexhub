import Image from "next/image";
import { UserRound } from "lucide-react";

export interface DashboardAvatarProps {
  profileImage?: string | null;
  name: string;
  size?: "small" | "large";
  className?: string;
}

export function Avatar({ profileImage, name, size = "small", className = "" }: DashboardAvatarProps) {
  const dimensions = size === "large" ? "size-[152px]" : "size-14";

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-slate-50 to-slate-200 ring-1 ring-slate-100 ${dimensions} ${className}`}>
      {profileImage ? (
        <Image alt={`${name} profile`} className="object-cover" fill sizes={size === "large" ? "152px" : "56px"} src={profileImage} unoptimized />
      ) : (
        <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_38%_25%,#f8fafc_0%,#e9edf3_58%,#dfe4eb_100%)] text-slate-500">
          <UserRound aria-hidden="true" className={size === "large" ? "size-[92px] stroke-[1.25]" : "size-8 stroke-[1.35]"} fill="currentColor" fillOpacity=".22" />
        </div>
      )}
    </div>
  );
}
