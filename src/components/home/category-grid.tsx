import Link from "next/link";
import { FaCarSide } from "react-icons/fa";
import { PiCarProfile } from "react-icons/pi";
import { TbCarSuv } from "react-icons/tb";
import { SectionHeading } from "@/components/shared/section-heading";
import type { TaxonomyOption } from "@/types/wordpress";

const categoryIcons = {
  sedan: PiCarProfile,
  suv: TbCarSuv,
  mpv: FaCarSide,
  hatchback: PiCarProfile,
};

export function CategoryGrid({ categories }: { categories: TaxonomyOption[] }) {
  return (
    <section className="pb-8 sm:pb-10">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <SectionHeading title="Browse by Category" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] ?? PiCarProfile;
            return (
              <Link className="group flex min-h-[118px] flex-col items-center justify-center rounded-lg border border-border bg-white transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md" href={`/car-type/${category.slug}`} key={category.id}>
                <Icon className="text-[32px] text-slate-900 transition-colors group-hover:text-primary" aria-hidden="true" />
                <span className="mt-3 text-sm font-semibold">{category.name}</span>
                <span className="mt-1 text-[11px] text-muted">{category.count} cars</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
