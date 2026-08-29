import { useEffect, useState } from "react";
import { HomeMark, SofaMark } from "./BrandMarks";

/** ~2s branded reveal played once per page load, before the hero appears. */
export function IntroOverlay() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }
    const t1 = setTimeout(() => setPhase("out"), 1700);
    const t2 = setTimeout(() => setPhase("done"), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className="canvas-gradient fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-500"
      style={
        phase === "out"
          ? { opacity: 0, clipPath: "inset(0 0 100% 0)" }
          : { opacity: 1, clipPath: "inset(0 0 0 0)" }
      }
    >
      <div className="flex flex-col items-center gap-5 text-primary">
        <div className="flex items-end gap-4">
          <SofaMark className="h-16 w-20 md:h-20 md:w-24" />
          <HomeMark className="h-14 w-14 opacity-0 md:h-16 md:w-16 [animation:rise-in_0.5s_ease_0.5s_forwards]" />
        </div>
        <p
          className="font-display text-2xl font-semibold tracking-tight text-foreground opacity-0 md:text-3xl [animation:rise-in_0.6s_cubic-bezier(0.22,1,0.36,1)_1s_forwards]"
        >
          DN Design Studio
        </p>
      </div>
    </div>
  );
}
