"use client";

import { useLightbox, LightboxOverlay } from "./LightboxImage";

// Deliberately a plain <img>, not next/image: this app self-hosts on a
// resource-constrained shared host where large/optional native packages
// (like sharp, which next/image's optimizer needs) have repeatedly failed
// to install silently — see the prisma CLI's identical failure mode. A
// fixed 220x220 avatar gains little from on-the-fly optimization anyway,
// so it's not worth that single point of fragility on the site's most
// prominent image.
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          width={220}
          height={220}
          fetchPriority="high"
          decoding="async"
          className="h-[220px] w-[220px] rounded-full border-4 border-violet-500 object-cover shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-transform hover:scale-105 hover:rotate-3"
        />
      </button>
      {open ? <LightboxOverlay src={src} alt={name} onClose={hide} /> : null}
    </>
  );
}
