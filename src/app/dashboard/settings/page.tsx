import type { Metadata } from "next";
import { SettingsPage } from "@/components/dashboard/SettingsPage";

export const metadata: Metadata = { title: "Account Settings" };

export default function SellerSettingsPage() {
  return <SettingsPage />;
}
