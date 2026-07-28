import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface-subtle px-6 text-center">
      <div>
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
        <Link className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 font-semibold text-white" href="/">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
