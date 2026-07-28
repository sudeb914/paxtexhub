"use client";

import { useEffect, useState } from "react";
import { SitePreloader } from "@/components/shared/site-preloader";

const DISPLAY_TIME = 1100;
const FADE_TIME = 280;

export function InitialSitePreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), DISPLAY_TIME);
    const removeTimer = window.setTimeout(() => setVisible(false), DISPLAY_TIME + FADE_TIME);
    return () => { window.clearTimeout(leaveTimer); window.clearTimeout(removeTimer); };
  }, []);

  if (!visible) return null;
  return <div className={`transition-opacity duration-300 ${leaving ? "pointer-events-none opacity-0" : "opacity-100"}`}><SitePreloader /></div>;
}
