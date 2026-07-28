"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Trash2, X } from "lucide-react";

export function DeleteListingButton({ id, title, onDeleted }: { id: number; title: string; onDeleted: () => void }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape" && !isDeleting) setOpen(false); }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, isDeleting]);

  async function removeListing() {
    if (isDeleting) return;
    setIsDeleting(true); setError("");
    try {
      const response = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) { setError(result.error || "Unable to delete the listing."); return; }
      setOpen(false); onDeleted();
    } catch { setError("Unable to connect. Please try again."); }
    finally { setIsDeleting(false); }
  }

  return <>
    <button aria-label={`Delete ${title}`} className="inline-flex h-9 items-center gap-2 rounded-md border border-red-100 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50" onClick={() => { setError(""); setOpen(true); }} type="button"><Trash2 className="size-4" /><span className="sm:hidden xl:inline">Delete</span></button>
    {open ? <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/40 px-5 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isDeleting) setOpen(false); }}>
      <div aria-labelledby={`delete-title-${id}`} aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="dialog">
        <div className="flex items-start justify-between"><div className="grid size-11 place-items-center rounded-full bg-red-50 text-red-600"><Trash2 className="size-5" /></div><button aria-label="Close confirmation" className="grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100" disabled={isDeleting} onClick={() => setOpen(false)} type="button"><X className="size-5" /></button></div>
        <h2 className="mt-5 text-xl font-bold text-[#0b1426]" id={`delete-title-${id}`}>Move listing to Trash?</h2>
        <p className="mt-2 text-sm leading-6 text-[#627189]"><span className="font-semibold text-[#33445c]">{title}</span> will be removed from your marketplace listings. It can still be recovered from WordPress Trash.</p>
        {error ? <p className="mt-4 flex gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</p> : null}
        <div className="mt-6 flex justify-end gap-3"><button className="h-10 rounded-lg border border-[#dfe4eb] px-4 text-sm font-semibold text-[#33445c] hover:bg-slate-50" disabled={isDeleting} onClick={() => setOpen(false)} type="button">Cancel</button><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60" disabled={isDeleting} onClick={removeListing} type="button"><Trash2 className="size-4" />{isDeleting ? "Deleting..." : "Move to Trash"}</button></div>
      </div>
    </div> : null}
  </>;
}
