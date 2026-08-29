import { useCallback, useRef, useState } from "react";

export function BeforeAfter({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-4/3 w-full select-none overflow-hidden rounded-3xl"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) update(e.clientX);
      }}
    >
      <img
        src={after}
        alt={`${alt} — after`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before}
          alt={`${alt} — before`}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ width: ref.current?.offsetWidth ? `${ref.current.offsetWidth}px` : "100%" }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-background">
          Before
        </span>
      </div>
      <span className="absolute right-3 top-3 rounded-full bg-primary/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground">
        After
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-background/90"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full glass-strong text-primary">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 6 4 12l5 6M15 6l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Reveal before and after for ${alt}`}
        className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
