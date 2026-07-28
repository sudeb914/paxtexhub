"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function logout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      router.replace("/login");
      router.refresh();
    } catch {
      setLogoutError("Unable to log out. Please try again.");
      setIsLoggingOut(false);
    }
  }

  return { isLoggingOut, logoutError, logout };
}
