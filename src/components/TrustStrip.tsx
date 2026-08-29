import { Star } from "lucide-react";
import { SITE } from "@/lib/site";

export function TrustStrip() {
  return (
    <div className="glass-strong mx-auto flex max-w-4xl flex-col items-center gap-2 rounded-full px-6 py-4 text-center sm:flex-row sm:justify-center sm:gap-4">
      <span className="flex items-center gap-1 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </span>
      <p className="text-sm font-semibold tracking-tight">
        {SITE.rating}★ · {SITE.reviewCount}+ Google Reviews · Trusted Interior Studio in{" "}
        {SITE.city}
      </p>
    </div>
  );
}
