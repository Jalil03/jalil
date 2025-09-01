// src/components/Ticker.jsx
import React, { useLayoutEffect, useRef, useState } from "react";

/**
 * Ticker – seamless infinite marquee
 * props:
 *  - items: string[]
 *  - speed: number (px per second), default 90
 *  - gap:   number (px between pills), default 14
 *  - className: string
 *  - fullBleed: boolean (use with .full-bleed helper)
 */
export default function Ticker({
  items = [],
  speed = 90,
  gap = 14,
  className = "",
  fullBleed = false,
}) {
  const viewportRef = useRef(null);
  const baseRowRef = useRef(null);

  const [shift, setShift]   = useState(0);   // px to travel per loop (width of one row)
  const [clones, setClones] = useState(2);   // how many extra copies we need (>=2)
  const [duration, setDuration] = useState(20);

  useLayoutEffect(() => {
    function recalc() {
      const vp  = viewportRef.current;
      const row = baseRowRef.current;
      if (!vp || !row) return;

      const baseWidth = row.scrollWidth;      // px width of one items row
      const vpWidth   = vp.clientWidth;
      if (!baseWidth || !vpWidth) return;

      // Make sure track covers the viewport as we shift by one base row
      const need = Math.max(2, Math.ceil((vpWidth + baseWidth) / baseWidth));
      setClones(need);
      setShift(baseWidth);

      // duration = distance(px) / speed(px/s)
      const pxPerSec = Math.max(30, speed);
      setDuration(baseWidth / pxPerSec);
    }

    recalc();
    const ro = new ResizeObserver(recalc);
    viewportRef.current && ro.observe(viewportRef.current);
    baseRowRef.current   && ro.observe(baseRowRef.current);
    window.addEventListener("resize", recalc);
    return () => { ro.disconnect(); window.removeEventListener("resize", recalc); };
  }, [speed, items.join("|")]);

  // Responsive gap: smaller on narrow screens (min 6px, ~3vw on phones, up to `gap`)
  const pillVars = { "--gap": `clamp(6px, 3vw, ${gap}px)` };

  return (
    <div className={`${fullBleed ? "full-bleed" : ""} ${className || ""}`}>
      <div
        ref={viewportRef}
        className="relative overflow-hidden py-3 w-full"
        style={{
          background:
            "linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg-card) 55%, transparent), transparent)",
        }}
      >
        {/* fade edges — narrower on small screens so they don't hide content */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 md:w-12"
          style={{ background: "linear-gradient(to right, var(--bg-base), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 md:w-12"
          style={{ background: "linear-gradient(to left, var(--bg-base), transparent)" }}
        />

        {/* animated track */}
        <div
          className="flex items-center w-max will-change-transform select-none
                     [animation-name:ticker-loop] [animation-timing-function:linear]
                     [animation-iteration-count:infinite]"
          style={{ animationDuration: `${duration}s`, transform: "translateZ(0)" }}
        >
          {/* base row */}
          <Row ref={baseRowRef} items={items} style={pillVars} />

          {/* clones (>= 1) */}
          {Array.from({ length: Math.max(1, clones - 1) }).map((_, i) => (
            <Row key={i} items={items} style={pillVars} aria-hidden />
          ))}
        </div>
      </div>

      {/* local styles so shift distance matches the measured row width */}
      <style>{`
        @keyframes ticker-loop {
          from { transform: translateX(0); }
          to   { transform: translateX(-${Math.max(0, Math.round(shift))}px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [animation-name="ticker-loop"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

// One sequence of pills
const Row = React.forwardRef(function Row({ items, style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className="flex items-center gap-[var(--gap)] pr-[var(--gap)]"
      style={style}
      {...rest}
    >
      {items.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="shrink-0 badge text-[11px] sm:text-sm px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full
                     bg-[color-mix(in_srgb,var(--bg-elevated) 85%,transparent)]
                     border border-base/70 text-subtext hover:text-text transition-colors"
        >
          {t}
        </span>
      ))}
    </div>
  );
});
