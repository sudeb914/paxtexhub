import Image from "next/image";
import Link from "next/link";
import { FiMapPin } from "react-icons/fi";
import { LuFuel, LuGauge, LuGitBranch } from "react-icons/lu";
import type { Car } from "@/types/car";

const number = new Intl.NumberFormat("en-US");

function formatPrice(car: Car) {
  if (car.currency === "BDT") return `৳${number.format(car.price)}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(car.price);
}

export function CarListItem({ car }: { car: Car }) {
  const href = `/cars/${car.slug}`;
  return (
    <article className="group grid overflow-hidden rounded-lg border border-border bg-white shadow-[0_2px_9px_rgba(15,23,42,.04)] transition hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(15,23,42,.08)] sm:grid-cols-[190px_1fr] lg:grid-cols-[205px_1fr]">
      <Link className="relative min-h-[190px] overflow-hidden bg-slate-100 sm:min-h-[150px]" href={href}>
        <Image alt={car.images[0].alt} className="object-cover transition duration-500 group-hover:scale-[1.04]" fill sizes="(max-width: 640px) 100vw, 205px" src={car.images[0].url} />
      </Link>
      <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:p-6">
        <div>
          <h2 className="text-base font-bold sm:text-lg"><Link className="transition-colors hover:text-primary" href={href}>{car.title}</Link></h2>
          <p className="mt-1.5 text-lg font-bold text-primary">{formatPrice(car)}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5"><LuGauge aria-hidden="true" />{number.format(car.mileage)} km</span>
            <span className="inline-flex items-center gap-1.5"><FiMapPin aria-hidden="true" />{car.location}</span>
            {car.fuelType !== "Not specified" ? <span className="inline-flex items-center gap-1.5"><LuFuel aria-hidden="true" />{car.fuelType}</span> : null}
            {car.transmission !== "Not specified" ? <span className="inline-flex items-center gap-1.5"><LuGitBranch aria-hidden="true" />{car.transmission}</span> : null}
          </div>
        </div>
        <Link className="inline-flex h-10 items-center justify-center rounded-md border border-primary px-4 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white sm:self-end" href={href}>View Details</Link>
      </div>
    </article>
  );
}
