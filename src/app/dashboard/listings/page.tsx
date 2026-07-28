import type { Metadata } from "next";
import { MyListingsPage } from "@/components/dashboard/MyListingsPage";

export const metadata: Metadata = { title: "My Listings" };

export default function ListingsPage() {
  return <MyListingsPage />;
}
