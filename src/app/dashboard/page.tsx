import type { Metadata } from "next";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { DashboardCompletionNotice } from "@/components/dashboard/DashboardCompletionNotice";

export const metadata: Metadata = { title: "Seller Dashboard" };

export default function DashboardPage() {
  return <><DashboardCompletionNotice /><WelcomeCard /><DashboardCard /></>;
}
