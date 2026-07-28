"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function ArchiveSort({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function changeSort(nextSort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextSort === "newest") params.delete("sort");
    else params.set("sort", nextSort);
    params.delete("page");
    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname));
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      <span>Sort by</span>
      <select
        aria-label="Sort cars"
        className="h-10 rounded-md border border-border bg-white px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
        disabled={isPending}
        onChange={(event) => changeSort(event.target.value)}
        value={value}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </label>
  );
}
