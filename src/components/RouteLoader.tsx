import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { HomeMark } from "./BrandMarks";

/** 1.5s branded loader shown only on real route changes. */
export function RouteLoader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="canvas-gradient fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-4"
    >
      <HomeMark className="h-14 w-14 text-primary" />
      <span className="font-display text-sm font-semibold uppercase tracking-[0.35em] text-foreground/70">
        DN Design Studio
      </span>
      <span className="h-0.5 w-40 overflow-hidden rounded-full bg-primary/20">
        <span className="block h-full w-full origin-left bg-primary [animation:rise-in_1.4s_linear_forwards]" />
      </span>
    </div>
  );
}
