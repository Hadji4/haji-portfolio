"use client";

import { useState } from "react";
import { LightboxOverlay } from "./LightboxImage";

// Content is written through the admin's rich text editor and sanitized
// server-side before storage (see sanitize-content.ts), so rendering it
// directly here is safe — there's no other write path into this field.
export function BlogContent({ html }: { html: string }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      {/* break-words so a long unbroken string (a pasted URL) wraps instead of
          pushing the page wider than the screen. Scoped to this container
          rather than set globally — overflow rules on html/body break
          position: sticky for the whole site's headers and sidebar. */}
      <article
        className="prose prose-invert mt-10 max-w-none break-words prose-img:cursor-zoom-in prose-img:rounded-xl prose-a:text-accent-violet"
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === "IMG") {
            setLightboxSrc((target as HTMLImageElement).src);
          }
        }}
      />
      {lightboxSrc ? (
        <LightboxOverlay src={lightboxSrc} alt="" onClose={() => setLightboxSrc(null)} />
      ) : null}
    </>
  );
}
