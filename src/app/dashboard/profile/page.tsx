import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfilePage } from "@/components/dashboard/ProfilePage";
import type { DashboardSeller } from "@/components/dashboard/ProfileCard";

export const metadata: Metadata = { title: "Seller Profile" };
const seller: DashboardSeller = { username: "seller_test", role: "Seller", email: null, profileImage: null };

export default function SellerProfilePage() { return <DashboardLayout seller={seller}><ProfilePage /></DashboardLayout>; }
