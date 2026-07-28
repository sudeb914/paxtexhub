import type { SellerListingStatus } from "@/types/seller-listing";

const styles: Record<SellerListingStatus, string> = {
  publish: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/15",
  draft: "bg-slate-100 text-slate-600 ring-slate-500/15",
};

const labels: Record<SellerListingStatus, string> = { publish: "Published", pending: "Pending", draft: "Draft" };

export function ListingStatusBadge({ status }: { status: SellerListingStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>{labels[status]}</span>;
}
