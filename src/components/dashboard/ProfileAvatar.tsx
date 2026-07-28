import Image from "next/image";
import { UserRound } from "lucide-react";

export function ProfileAvatar({ image, name }: { image: string | null; name: string }) {
  return <div className="relative size-[144px] overflow-hidden rounded-full bg-[#eef1f5] ring-1 ring-[#e5e9ef]">{image ? <Image alt={`${name} profile`} className="object-cover" fill sizes="144px" src={image} unoptimized /> : <div className="grid size-full place-items-center text-[#8793a5]"><UserRound className="size-[90px] stroke-[1.25]" fill="currentColor" fillOpacity=".18" /></div>}</div>;
}
