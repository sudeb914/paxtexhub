import Image from "next/image";
import { UserRound } from "lucide-react";

export function ProfileAvatar({ image, name }: { image: string | null; name: string }) {
  return (
    <div className="size-[144px] rounded-full bg-gradient-to-br from-[#0864ff] via-[#38bdf8] to-[#4f46e5] p-1 shadow-[0_8px_24px_rgba(8,100,255,0.18)]">
      <div className="relative size-full overflow-hidden rounded-full border-2 border-white bg-[#eef1f5]">
        {image ? <Image alt={`${name} profile`} className="object-cover" fill sizes="136px" src={image} unoptimized /> : <div className="grid size-full place-items-center text-[#8793a5]"><UserRound className="size-[84px] stroke-[1.25]" fill="currentColor" fillOpacity=".18" /></div>}
      </div>
    </div>
  );
}
