import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { reviewsQuery } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { TrustStrip } from "@/components/TrustStrip";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Client Reviews — DN Design Studio Home Interiors, Vijayawada" },
      {
        name: "description",
        content:
          "4.9★ from 65+ Google reviews. Read what Vijayawada families say about working with DN Design Studio Home Interiors.",
      },
      { property: "og:title", content: "Client Reviews — DN Design Studio Home Interiors" },
      {
        property: "og:description",
        content: "4.9★ from 65+ Google reviews from families across Vijayawada.",
      },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { data, isLoading } = useQuery(reviewsQuery());
  const reviews = data?.reviews ?? [];
  const media = data?.media ?? {};
  const videoReviews = reviews.filter((r) => r.video_url);

  return (
    <div className="px-4 pb-8 md:px-6">
      <section className="mx-auto max-w-3xl py-14 text-center md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Reviews</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] md:text-5xl">
          What our <em>families say</em>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          We'd rather let the people whose homes we've finished do the talking.
        </p>
      </section>

      <section className="mx-auto mb-14 max-w-6xl">
        <TrustStrip />
      </section>

      {videoReviews.length > 0 && (
        <section className="mx-auto mb-14 grid max-w-5xl gap-6 md:grid-cols-2">
          {videoReviews.slice(0, 2).map((r) => (
            <div key={r.id} className="glass-tint overflow-hidden rounded-[2rem] p-4">
              <div className="aspect-video overflow-hidden rounded-2xl bg-ink/5">
                <iframe
                  src={r.video_url ?? undefined}
                  title={`Video review from ${r.name}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <p className="mt-4 px-2 font-display text-sm font-bold">{r.name}</p>
            </div>
          ))}
        </section>
      )}

      {isLoading && (
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass h-56 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="glass-strong mx-auto max-w-2xl rounded-[2rem] p-10 text-center">
          <h2 className="font-display text-xl font-bold">Reviews are on their way</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            In the meantime, all {SITE.reviewCount}+ of our reviews are live on Google.
          </p>
        </div>
      )}

      {reviews.length > 0 && (
        <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <article key={r.id} className="glass-tint flex flex-col rounded-[2rem] p-6">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : "opacity-25"}`} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">{r.body}</p>
              {r.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {r.images.map((img) =>
                    media[img] ? (
                      <img
                        key={img}
                        src={media[img]}
                        alt={`Project photo shared by ${r.name}`}
                        loading="lazy"
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                    ) : null,
                  )}
                </div>
              )}
              <p className="mt-5 font-display text-sm font-bold">{r.name}</p>
            </article>
          ))}
        </section>
      )}

      <div className="mt-14 text-center">
        <Button asChild variant="glass" size="lg">
          <a href={SITE.googleReviews} target="_blank" rel="noopener noreferrer">
            See all reviews on Google
          </a>
        </Button>
      </div>
    </div>
  );
}
