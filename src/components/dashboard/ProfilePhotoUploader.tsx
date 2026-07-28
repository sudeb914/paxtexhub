"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ProfileAvatar } from "@/components/dashboard/ProfileAvatar";

export function ProfilePhotoUploader({ image, name, onChange, onFileChange }: { image: string | null; name: string; onChange: (image: string | null) => void; onFileChange: (file: File | null) => void }) {
  const input = useRef<HTMLInputElement>(null); const [error, setError] = useState("");
  function choose(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"].includes(file.type)) || file.size > 5 * 1024 * 1024) { setError("Choose a JPG, JPEG, PNG or WebP image up to 5 MB."); return; }
    const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === "string") { onChange(reader.result); onFileChange(file); setError(""); } }; reader.readAsDataURL(file);
  }
  return <div className="flex flex-col items-center"><ProfileAvatar image={image} name={name} /><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="h-11 rounded-lg bg-[#eef1f5] px-5 text-sm font-semibold text-[#172236] transition hover:bg-[#e4e8ee]" onClick={() => input.current?.click()} type="button">Upload Photo</button><button className="h-11 rounded-lg bg-[#0864ff] px-5 text-sm font-semibold text-white transition hover:bg-[#0757dc] disabled:cursor-not-allowed disabled:opacity-50" disabled={!image} onClick={() => { onChange(null); onFileChange(null); if (input.current) input.current.value = ""; }} type="button">Remove Photo</button></div><input accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={choose} ref={input} type="file" />{error ? <p className="mt-2 text-xs text-red-600" role="alert">{error}</p> : null}</div>;
}
