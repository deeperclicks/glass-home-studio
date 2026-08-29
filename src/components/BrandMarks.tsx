import { cn } from "@/lib/utils";

export function SofaMark({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 64 48" fill="none" className={className} aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={
          animate
            ? { strokeDasharray: 1, strokeDashoffset: 1, animation: "draw-stroke 1s ease forwards" }
            : undefined
        }
      >
        <path d="M12 26v-8a5 5 0 0 1 5-5h30a5 5 0 0 1 5 5v8" />
        <path d="M8 26a4 4 0 0 1 8 0v6h32v-6a4 4 0 0 1 8 0v11H8z" />
        <path d="M16 32h32" />
        <path d="M14 37v4M50 37v4" />
      </g>
    </svg>
  );
}

export function HomeMark({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={
          animate
            ? {
                strokeDasharray: 1,
                strokeDashoffset: 1,
                animation: "draw-stroke 0.9s ease 0.45s forwards",
              }
            : undefined
        }
      >
        <path d="M6 22 24 7l18 15" />
        <path d="M10 21v19h28V21" />
        <path d="M19 40V28h10v12" />
      </g>
    </svg>
  );
}
