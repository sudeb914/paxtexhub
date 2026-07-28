import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function Pagination({ page, totalPages, query, basePath = "/cars" }: { page: number; totalPages: number; query: Record<string, string | undefined>; basePath?: string }) {
  if (totalPages <= 1) return null;

  const visiblePages = Array.from(new Set([1, page - 1, page, page + 1, totalPages])).filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);

  function href(target: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value && key !== "page") params.set(key, value);
    params.set("page", String(target));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <nav aria-label="Car listing pagination" className="mt-8 flex items-center justify-center gap-2">
      <PageLink disabled={page === 1} href={href(page - 1)} label="Previous"><FiChevronLeft /></PageLink>
      {visiblePages.map((number, index) => (
        <span className="contents" key={number}>
          {index > 0 && number - visiblePages[index - 1] > 1 ? <span className="grid size-8 place-items-center text-muted">…</span> : null}
          <Link aria-current={number === page ? "page" : undefined} className={`grid size-10 place-items-center rounded-md border text-sm font-semibold transition ${number === page ? "border-primary bg-primary text-white" : "border-border bg-white hover:border-primary hover:text-primary"}`} href={href(number)}>{number}</Link>
        </span>
      ))}
      <PageLink disabled={page === totalPages} href={href(page + 1)} label="Next"><FiChevronRight /></PageLink>
    </nav>
  );
}

function PageLink({ disabled, href, label, children }: { disabled: boolean; href: string; label: string; children: React.ReactNode }) {
  if (disabled) return <span aria-disabled="true" aria-label={label} className="grid size-10 place-items-center rounded-md border border-border bg-slate-50 text-slate-300">{children}</span>;
  return <Link aria-label={label} className="grid size-10 place-items-center rounded-md border border-border bg-white transition hover:border-primary hover:text-primary" href={href}>{children}</Link>;
}
