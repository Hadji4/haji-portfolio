"use client";

import Image from "next/image";
import { useLightbox, LightboxOverlay } from "./LightboxImage";

export function HeroPhoto({ src, name }: { src: string; name: string }) {
  const { open, show, hide } = useLightbox();

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="cursor-zoom-in"
        aria-label={`View ${name}'s photo full size`}
      >
        <Image
          src={src}
          alt={name}
          width={220}
          height={220}
          priority
          className="h-[220px] w-[220px] rounded-full border-4 border-violet-500 object-cover shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-transform hover:scale-105 hover:rotate-3"
        />
      </button>
      {open ? <LightboxOverlay src={src} alt={name} onClose={hide} /> : null}
    </>
  );
}
