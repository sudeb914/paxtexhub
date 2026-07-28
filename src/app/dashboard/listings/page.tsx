import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MyListingsPage } from "@/components/dashboard/MyListingsPage";
import type { DashboardSeller } from "@/components/dashboard/ProfileCard";

export const metadata: Metadata = { title: "My Listings" };

const seller: DashboardSeller = { username: "seller_test", role: "Seller", email: null, profileImage: null };

export default function ListingsPage() {
  return <DashboardLayout seller={seller}><MyListingsPage /></DashboardLayout>;
}
