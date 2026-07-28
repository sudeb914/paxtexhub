import Image from "next/image";
import Link from "next/link";
import { FiMapPin } from "react-icons/fi";
import { LuGauge } from "react-icons/lu";
import type { Car } from "@/types/car";

const number = new Intl.NumberFormat("en-US");

function formatPrice(car: Car) {
  if (car.currency === "BDT") return `৳${number.format(car.price)}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(car.price);
}

export function CarCard({ car }: { car: Car }) {
  const href = `/cars/${car.slug}`;
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-white shadow-[0_2px_10px_rgba(15,23,42,.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,.1)]">
      <Link className="relative block aspect-[1.55] overflow-hidden bg-slate-100" href={href}>
        <Image alt={car.images[0].alt} className="object-cover transition duration-500 group-hover:scale-[1.04]" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" src={car.images[0].url} />
      </Link>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold"><Link className="transition-colors hover:text-primary" href={href}>{car.title}</Link></h3>
        <p className="mt-2 text-base font-bold text-primary">{formatPrice(car)}</p>
        <div className="mt-5 flex items-center justify-between gap-3 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5"><LuGauge aria-hidden="true" />{number.format(car.mileage)} km</span>
          <span className="inline-flex items-center gap-1.5"><FiMapPin aria-hidden="true" />{car.location}</span>
        </div>
      </div>
    </article>
  );
}
