"use client";

import { useEffect, useRef, useState } from "react";
import { getStatIcon } from "@/lib/stat-icons";

function StatIcon({ label, size }: { label: string; size: number }) {
  // getStatIcon returns a stable reference to one of a fixed set of
  // already-defined icon components (keyword-matched on the label) — it
  // doesn't create anything new, so this isn't the "component defined
  // during render" pattern the rule is guarding against.
  const Icon = getStatIcon(label);
  // eslint-disable-next-line react-hooks/static-components
  return <Icon size={size} />;
}

export function StatCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 900;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.ceil(progress * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      ref={ref}
      className="card-surface flex flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 text-accent-violet">
        <StatIcon label={label} size={19} />
      </span>
      <div className="font-display gradient-text text-3xl font-bold">
        {count}
        {count === target ? "+" : ""}
      </div>
      <div className="text-xs leading-snug font-medium text-muted">{label}</div>
    </div>
  );
}
