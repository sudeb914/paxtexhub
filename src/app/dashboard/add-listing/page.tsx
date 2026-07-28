import type { Metadata } from "next";
import { AddListingForm } from "@/components/dashboard/AddListingForm";
import { getWordPressTaxonomies } from "@/services/wordpress/wordpress-api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getWordPressProfile } from "@/services/wordpress/wordpress-profile-service";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import { ProfileCompletionAlert } from "@/components/dashboard/ProfileCompletionAlert";

export const metadata: Metadata = { title: "Add New Listing" };
export const dynamic = "force-dynamic";

export default async function AddListingPage() {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) redirect("/login");
  const profile = await getWordPressProfile(token).catch(() => null);
  const completion = calculateProfileCompletion(profile);
  if (!completion.isComplete) {
    return <section><div><h1 className="text-[30px] font-bold tracking-[-0.035em] text-[#0b1426] sm:text-[34px]">Add New Listing</h1><p className="mt-2 text-[15px] leading-6 text-[#627189] sm:text-base">Complete your seller profile before adding a vehicle.</p></div><div className="mt-8"><ProfileCompletionAlert completion={completion} /></div></section>;
  }
  const taxonomies = await getWordPressTaxonomies();
  return <section><div><h1 className="text-[30px] font-bold tracking-[-0.035em] text-[#0b1426] sm:text-[34px]">Add New Listing</h1><p className="mt-2 text-[15px] leading-6 text-[#627189] sm:text-base">Add your vehicle details and submit the listing for review.</p></div><div className="mt-8 rounded-[18px] border border-[#e8ebef] bg-white p-6 shadow-[0_5px_18px_rgba(20,31,50,.055)] sm:p-8"><h2 className="text-xl font-bold tracking-[-0.02em] text-[#0b1426]">Vehicle information</h2><p className="mt-2 text-sm text-[#627189]">Fields marked by the browser as required must be completed.</p><AddListingForm brands={taxonomies.brands} carTypes={taxonomies.carTypes} locations={taxonomies.locations} /></div></section>;
}
