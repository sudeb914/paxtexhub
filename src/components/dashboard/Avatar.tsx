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
  const padding = size === "large" ? "p-1" : "p-0.5";

  return (
    <div className={`shrink-0 rounded-full bg-gradient-to-br from-[#0864ff] via-[#38bdf8] to-[#4f46e5] shadow-[0_6px_20px_rgba(8,100,255,0.2)] ${dimensions} ${padding} ${className}`}>
      <div className="relative size-full overflow-hidden rounded-full border border-white bg-slate-100">
        {profileImage ? (
          <Image alt={`${name} profile`} className="object-cover" fill sizes={size === "large" ? "142px" : "50px"} src={profileImage} unoptimized />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_38%_25%,#f8fafc_0%,#e9edf3_58%,#dfe4eb_100%)] text-slate-500">
            <UserRound aria-hidden="true" className={size === "large" ? "size-[88px] stroke-[1.25]" : "size-7 stroke-[1.35]"} fill="currentColor" fillOpacity=".22" />
          </div>
        )}
      </div>
    </div>
  );
}
