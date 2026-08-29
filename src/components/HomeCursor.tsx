import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, [data-cursor='link']";
const GALLERY = "img, picture, video, [data-cursor='tilt']";

/**
 * Animated home-icon cursor. Desktop (fine pointer) only.
 * Trailing follow, hover grow, click press, gentle tilt over imagery.
 */
export function HomeCursor() {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-home-cursor");

    let raf = 0;
    let tx = -100;
    let ty = -100;
    let cx = -100;
    let cy = -100;
    let interactive = false;
    let tilting = false;
    let pressed = false;

    const apply = () => {
      const el = inner.current;
      if (!el) return;
      const scale = pressed ? 0.8 : interactive ? 1.28 : 1;
      const rotate = tilting && !pressed ? 10 : 0;
      el.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
      el.style.filter = pressed
        ? "drop-shadow(0 1px 2px rgb(0 0 0 / 0.2))"
        : interactive
          ? "drop-shadow(0 6px 10px rgb(0 0 0 / 0.4))"
          : "drop-shadow(0 3px 5px rgb(0 0 0 / 0.28))";
    };

    const loop = () => {
      raf = 0;
      // smooth trailing ease
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (outer.current) outer.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(loop);
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      kick();
    };

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const nextInteractive = !!t?.closest?.(INTERACTIVE);
      const nextTilting = !!t?.closest?.(GALLERY);
      if (nextInteractive !== interactive || nextTilting !== tilting) {
        interactive = nextInteractive;
        tilting = nextTilting;
        apply();
      }
    };

    const down = () => {
      pressed = true;
      apply();
    };
    const up = () => {
      pressed = false;
      apply();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-home-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={outer}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-3 -mt-3 hidden md:block"
    >
      <div
        ref={inner}
        className="transition-[transform,filter] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ filter: "drop-shadow(0 3px 5px rgb(0 0 0 / 0.28))" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11 12 3l9 8"
            stroke="var(--primary)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 10.5V20h13v-9.5"
            fill="var(--card)"
            stroke="var(--primary)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 20v-5h4v5" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
