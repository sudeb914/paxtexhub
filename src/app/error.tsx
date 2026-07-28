"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <button className="mt-5 rounded-md bg-primary px-5 py-2.5 font-semibold text-white" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
