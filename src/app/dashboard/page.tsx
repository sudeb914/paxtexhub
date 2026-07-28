import type { Metadata } from "next";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";

export const metadata: Metadata = { title: "Seller Dashboard" };

export default function DashboardPage() {
  return <><WelcomeCard /><DashboardCard /></>;
}
