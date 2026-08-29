import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HomeMark, SofaMark } from "./BrandMarks";

type Phase = "home" | "sofa" | "text" | "out" | "done";

/** ~2.3s branded reveal: home icon → sofa → "DN Design Studio", then wipe away. */
export function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("home");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }
    const t1 = setTimeout(() => setPhase("sofa"), 450);
    const t2 = setTimeout(() => setPhase("text"), 850);
    const t3 = setTimeout(() => setPhase("out"), 1650);
    const t4 = setTimeout(() => setPhase("done"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
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
      <div className="relative flex h-40 w-full max-w-2xl items-center justify-center px-8">
        {/* Phase 1: Home icon */}
        <div
          className={cn(
            "absolute flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            phase === "home"
              ? "opacity-100 scale-100 rotate-0 blur-0"
              : "opacity-0 scale-125 -rotate-12 blur-sm",
          )}
        >
          <HomeMark animate={false} className="h-16 w-16 text-primary md:h-20 md:w-20" />
        </div>

        {/* Phase 2: Sofa icon */}
        <div
          className={cn(
            "absolute flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            phase === "sofa"
              ? "opacity-100 scale-100 blur-0"
              : "opacity-0 scale-90 blur-sm",
            phase === "home" ? "scale-75" : "",
          )}
        >
          <SofaMark animate={false} className="h-16 w-20 text-primary md:h-20 md:w-24" />
        </div>

        {/* Phase 3: Brand name with frosted glass backdrop */}
        <div
          className={cn(
            "absolute flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
            phase === "text" || phase === "out"
              ? "opacity-100 translate-y-0 blur-0"
              : "opacity-0 translate-y-4 blur-md",
          )}
        >
          <div className="glass-strong rounded-[2rem] px-8 py-4 md:px-10 md:py-5">
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              DN Design Studio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
