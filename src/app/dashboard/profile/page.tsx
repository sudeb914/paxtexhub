import type { Metadata } from "next";
import { ProfilePage } from "@/components/dashboard/ProfilePage";

export const metadata: Metadata = { title: "Seller Profile" };
export default function SellerProfilePage() { return <ProfilePage />; }
