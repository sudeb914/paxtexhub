import Image from "next/image";
import { FiClock, FiShield, FiUsers } from "react-icons/fi";
import { PiCarProfile } from "react-icons/pi";
import { SearchBar } from "@/components/home/search-bar";
import type { TaxonomyOption } from "@/types/wordpress";

const stats = [
  { value: "10K+", label: "Cars for Sale", icon: PiCarProfile },
  { value: "500+", label: "Trusted Sellers", icon: FiUsers },
  { value: "100%", label: "Secure Platform", icon: FiShield },
  { value: "24/7", label: "Support", icon: FiClock },
];

export function Hero({ brands, carTypes, locations }: { brands: TaxonomyOption[]; carTypes: TaxonomyOption[]; locations: TaxonomyOption[] }) {
  return (
    <section className="relative isolate min-h-[570px] overflow-hidden bg-navy text-white lg:min-h-[610px]">
      <Image alt="Dark luxury sedan beside a waterfront city at dusk" className="object-cover object-[68%_center]" fill priority sizes="100vw" src="/images/hero/autohub-hero.png" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,13,26,.93)_0%,rgba(5,16,31,.78)_36%,rgba(5,16,31,.2)_70%,rgba(5,16,31,.2)_100%)]" />
      <div className="relative mx-auto flex min-h-[570px] max-w-[1240px] flex-col justify-center px-5 py-16 sm:px-8 lg:min-h-[610px] lg:px-10">
        <div className="max-w-[630px]">
          <h1 className="max-w-[520px] text-[44px] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[56px] lg:text-[64px]">
            Find Your<br /><span className="text-blue-500">Dream</span> Car
          </h1>
          <p className="mt-5 max-w-[460px] text-sm leading-6 text-slate-100 sm:text-base">Explore thousands of cars from trusted sellers<br className="hidden sm:block" /> and find the perfect match for you.</p>
          <div className="mt-8 max-w-[630px]"><SearchBar brands={brands} carTypes={carTypes} locations={locations} /></div>
          <div className="mt-12 grid max-w-[600px] grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div className="flex items-center gap-3" key={label}>
                <Icon className="shrink-0 text-[28px]" aria-hidden="true" />
                <div><strong className="block text-xl leading-none">{value}</strong><span className="mt-1 block text-[11px] text-slate-200">{label}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
