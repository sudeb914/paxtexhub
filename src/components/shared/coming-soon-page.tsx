interface ComingSoonPageProps {
  eyebrow?: string;
  title: string;
}

export function ComingSoonPage({ eyebrow = "AutoHub", title }: ComingSoonPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-surface-subtle px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-muted">This page is scheduled for its dedicated build phase.</p>
      </div>
    </main>
  );
}
