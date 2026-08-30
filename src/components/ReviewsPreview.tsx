import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewsQuery } from "@/lib/content";
import { SITE } from "@/lib/site";

export function ReviewsPreview() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useQuery(reviewsQuery());
  const reviews = (data?.reviews ?? []).slice(0, 6);
  const media = data?.media ?? {};

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-6xl py-10 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Reviews</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">
            {SITE.rating}★ from {SITE.reviewCount}+ families
          </h2>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="glass" onClick={() => scrollBy(-1)} aria-label="Previous reviews">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="glass" onClick={() => scrollBy(1)} aria-label="Next reviews">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass h-48 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="glass-strong mt-8 rounded-[2rem] p-10 text-center">
          <p className="text-sm text-muted-foreground">
            All {SITE.reviewCount}+ of our reviews are live on Google.
          </p>
        </div>
      )}

      {reviews.length > 0 && (
        <div
          ref={trackRef}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r) => (
            <article
              key={r.id}
              className="glass-tint flex w-[85%] shrink-0 snap-start flex-col rounded-[2rem] p-6 sm:w-[60%] lg:w-[calc(33.333%-0.9rem)]"
            >
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : "opacity-25"}`} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85 line-clamp-6">
                {r.body}
              </p>
              {r.images.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {r.images.slice(0, 3).map((img) =>
                    media[img] ? (
                      <img
                        key={img}
                        src={media[img]}
                        alt={`Project photo shared by ${r.name}`}
                        loading="lazy"
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : null,
                  )}
                </div>
              )}
              <p className="mt-5 font-display text-sm font-bold">{r.name}</p>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="glass">
          <a href={SITE.googleReviews} target="_blank" rel="noopener noreferrer">
            See all {SITE.reviewCount} reviews on Google
          </a>
        </Button>
        <Button asChild variant="glass">
          <Link to="/reviews">
            Read all reviews <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
