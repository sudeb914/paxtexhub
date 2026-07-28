import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your AutoHub account to save cars, contact sellers, and publish vehicle listings.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join AutoHub"
      title="Create your account"
      description="Start browsing with confidence or list your car and connect with interested buyers."
    >
      <RegisterForm />
    </AuthShell>
  );
}
