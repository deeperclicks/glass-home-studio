import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/components/BeforeAfter";
import { postsQuery } from "@/lib/content";

export function WorkPreview() {
  const { data, isLoading } = useQuery(postsQuery());
  const posts = (data?.posts ?? []).filter((p) => p.is_project).slice(0, 6);
  const media = data?.media ?? {};

  return (
    <section className="mx-auto max-w-6xl py-10 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Our work</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">
            Homes we've <em>handed over</em>
          </h2>
        </div>
        <Button asChild variant="glass">
          <Link to="/our-work">
            View all projects <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass h-64 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="glass-strong mt-8 rounded-[2rem] p-10 text-center">
          <p className="text-sm text-muted-foreground">
            New projects are being photographed — they'll appear here as soon as they're published.
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const cover = p.cover_image ? media[p.cover_image] : undefined;
            const before = p.before_image ? media[p.before_image] : undefined;
            const after = p.after_image ? media[p.after_image] : undefined;
            const isSlider = Boolean(p.featured && before && after);

            return (
              <article
                key={p.id}
                className="glass-tint group overflow-hidden rounded-[2rem] transition-transform duration-500 hover:-translate-y-1.5"
              >
                {isSlider ? (
                  <BeforeAfter before={before!} after={after!} alt={p.title} />
                ) : cover ? (
                  <img
                    src={cover}
                    alt={p.title}
                    loading="lazy"
                    className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="p-6">
                  {p.featured && (
                    <span className="mb-2 inline-block rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      Flagship project
                    </span>
                  )}
                  <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
                  {p.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {p.excerpt}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
