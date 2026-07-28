import Link from "next/link";
import { PiSteeringWheelBold } from "react-icons/pi";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className="inline-flex items-center gap-2 font-bold tracking-tight" href="/" aria-label="AutoHub home">
      <PiSteeringWheelBold className="text-xl text-primary" aria-hidden="true" />
      <span className={inverted ? "text-white" : "text-foreground"}>AutoHub.</span>
    </Link>
  );
}
