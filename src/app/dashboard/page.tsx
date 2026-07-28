import type { Metadata } from "next";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import type { DashboardSeller } from "@/components/dashboard/ProfileCard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";

export const metadata: Metadata = { title: "Seller Dashboard" };

const seller: DashboardSeller = {
  username: "seller_test",
  role: "Seller",
  email: null,
  profileImage: null,
};

export default function DashboardPage() {
  return <><WelcomeCard seller={seller} /><DashboardCard /></>;
}
