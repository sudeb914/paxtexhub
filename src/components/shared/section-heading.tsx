import Link from "next/link";

export function SectionHeading({ title, href, action }: { title: string; href?: string; action?: string }) {
  return (
    <div className="mb-7 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground sm:text-2xl">{title}</h2>
      {href && action ? <Link className="text-sm font-semibold text-primary transition hover:text-primary-hover" href={href}>{action}</Link> : null}
    </div>
  );
}
