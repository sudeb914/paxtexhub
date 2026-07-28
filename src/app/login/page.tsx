import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to AutoHub to manage your car listings, profile, and seller inquiries.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  const registrationSuccess = (await searchParams).registered === "1";
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to your account"
      description="Manage your listings, connect with buyers, and keep your AutoHub profile up to date."
    >
      <LoginForm registrationSuccess={registrationSuccess} />
    </AuthShell>
  );
}
