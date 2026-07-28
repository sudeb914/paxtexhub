"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { CarImage } from "@/types/car";

export function ImageGallery({ images }: { images: CarImage[] }) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div>
      <div className="relative aspect-[1.43] overflow-hidden rounded-lg bg-slate-100">
        <AnimatePresence initial={false} mode="wait">
          <motion.div animate={{ opacity: 1 }} className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0.45 }} key={selected.id} transition={{ duration: 0.2 }}>
            <Image alt={selected.alt} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 58vw" src={selected.url} />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3" role="list" aria-label="Vehicle images">
          {images.map((image) => (
            <button aria-label={`View ${image.alt}`} aria-pressed={image.id === selected.id} className={`relative aspect-[1.55] overflow-hidden rounded-md border-2 bg-slate-100 transition ${image.id === selected.id ? "border-primary" : "border-transparent hover:border-blue-200"}`} key={image.id} onClick={() => setSelected(image)} type="button">
              <Image alt="" className="object-cover" fill sizes="(max-width: 1024px) 25vw, 150px" src={image.url} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
