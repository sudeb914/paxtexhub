"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import type { SellerProfileResponse } from "@/types/seller-profile";

export function ProfilePage() {
  const router = useRouter(); const [profile, setProfile] = useState<SellerProfileResponse | null>(null); const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store", signal: controller.signal });
        const body = await response.json() as { profile?: SellerProfileResponse; error?: string };
        if (response.status === 401) { router.replace("/login"); return; }
        if (!response.ok || !body.profile) throw new Error(body.error ?? "Unable to load your profile.");
        setProfile(body.profile);
      } catch (loadError) { if (!controller.signal.aborted) setError(loadError instanceof Error ? loadError.message : "Unable to load your profile."); }
    }
    void load(); return () => controller.abort();
  }, [router]);
  return <section><h1 className="text-[30px] font-bold tracking-[-0.035em] text-[#0b1426] sm:text-[34px]">Profile</h1><p className="mt-2 text-[15px] text-[#627189] sm:text-base">Manage your seller profile information.</p><div className="mt-8 rounded-[18px] border border-[#e5e9ef] bg-white p-6 shadow-[0_5px_18px_rgba(20,31,50,.055)] sm:p-8 lg:p-10">{error ? <div className="py-20 text-center"><p className="font-semibold text-[#172236]">We couldn&apos;t load your profile.</p><p className="mt-2 text-sm text-[#627189]">{error}</p><button className="mt-5 rounded-lg bg-[#0864ff] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => window.location.reload()} type="button">Try Again</button></div> : profile ? <ProfileForm initialProfile={profile} /> : <ProfileLoading />}</div></section>;
}

function ProfileLoading() { return <div aria-label="Loading profile" className="animate-pulse"><div className="mx-auto size-36 rounded-full bg-slate-200" /><div className="mx-auto mt-5 h-11 w-72 rounded-lg bg-slate-200" /><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }).map((_, index) => <div className="h-16 rounded-lg bg-slate-100" key={index} />)}</div></div>; }
