import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EditListingForm } from "@/components/dashboard/EditListingForm";
import { getAuthenticatedWordPressUser } from "@/services/wordpress/wordpress-auth-service";
import { getOwnedWordPressListing } from "@/services/wordpress/wordpress-edit-listing-service";
import { getWordPressTaxonomies } from "@/services/wordpress/wordpress-api";

export const metadata: Metadata = { title: "Edit Listing" };
export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("partexhub_token")?.value; if (!token) redirect("/login");
  const id = Number((await params).id); if (!Number.isInteger(id) || id <= 0) redirect("/dashboard/listings");
  const user = await getAuthenticatedWordPressUser(token);
  const [listing, taxonomies] = await Promise.all([getOwnedWordPressListing(token, user.id, id), getWordPressTaxonomies()]);
  return <section><h1 className="text-[30px] font-bold tracking-[-0.035em] text-[#0b1426] sm:text-[34px]">Edit Listing</h1><p className="mt-2 text-[15px] text-[#627189]">Update your vehicle information and images.</p><div className="mt-8 rounded-[18px] border border-[#e8ebef] bg-white p-6 shadow-[0_5px_18px_rgba(20,31,50,.055)] sm:p-8"><h2 className="text-xl font-bold text-[#0b1426]">Vehicle information</h2><p className="mt-2 text-sm text-[#627189]">Current status: <span className="font-semibold capitalize">{listing.status}</span></p><EditListingForm brands={taxonomies.brands} carTypes={taxonomies.carTypes} listing={listing} locations={taxonomies.locations} /></div></section>;
}
