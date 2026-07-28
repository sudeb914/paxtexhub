import { CarCard } from "@/components/cars/car-card";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Car } from "@/types/car";

export function FeaturedCars({ cars }: { cars: Car[] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <SectionHeading action="View all" href="/cars" title="Featured Cars" />
        {cars.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{cars.slice(0, 4).map((car) => <CarCard car={car} key={car.id} />)}</div> : <p className="rounded-lg border border-dashed border-border bg-surface-subtle px-5 py-10 text-center text-sm text-muted">No featured cars are currently available.</p>}
      </div>
    </section>
  );
}
