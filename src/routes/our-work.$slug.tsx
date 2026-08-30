import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/components/BeforeAfter";
import { postBySlugQuery } from "@/lib/content";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/our-work/$slug")({
  head: () => ({
    meta: [
      { title: "Project — DN Design Studio, Vijayawada" },
      {
        name: "description",
        content:
          "A closer look at one of the homes designed and executed by DN Design Studio in Vijayawada — service, gallery and the client's own words.",
      },
      { property: "og:title", content: "Project — DN Design Studio" },
      {
        property: "og:description",
        content: "Cover shots, full gallery and client feedback from a DN Design Studio project.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectDetail,
});

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery(postBySlugQuery(slug));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 md:px-6">
        <div className="glass h-96 animate-pulse rounded-[2rem]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center md:px-6">
        <h1 className="font-display text-2xl font-extrabold">Project not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This project may have been unpublished. Browse the rest of our work instead.
        </p>
        <Button asChild variant="glass" className="mt-6">
          <Link to="/our-work">Back to our work</Link>
        </Button>
      </div>
    );
  }

  const { post, media } = data;
  const cover = post.cover_image ? media[post.cover_image] : undefined;
  const before = post.before_image ? media[post.before_image] : undefined;
  const after = post.after_image ? media[post.after_image] : undefined;
  const gallery = post.gallery.map((g) => media[g]).filter(Boolean) as string[];

  return (
    <article className="px-4 pb-16 md:px-6">
      <div className="mx-auto max-w-5xl pt-10">
        <Link
          to="/our-work"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        <header className="mt-6">
          {post.service && (
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {post.service}
            </p>
          )}
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] md:text-4xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
        </header>

        <div className="glass-tint mt-8 overflow-hidden rounded-[2rem]">
          {post.featured && before && after ? (
            <BeforeAfter before={before} after={after} alt={post.title} />
          ) : cover ? (
            <img src={cover} alt={post.title} className="w-full object-cover" />
          ) : null}
        </div>

        {post.content && (
          <div className="glass-strong mt-8 rounded-[2rem] p-7 md:p-10">
            <h2 className="font-display text-xl font-bold">
              About this <em>project</em>
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
              {post.content}
            </p>
          </div>
        )}

        {gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">Gallery</h2>
            <div className="mt-5 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {gallery.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${post.title} — photo ${i + 1}`}
                  loading="lazy"
                  className="w-full break-inside-avoid rounded-[1.5rem] object-cover"
                />
              ))}
            </div>
          </section>
        )}

        {post.client_rating != null && (
          <section className="glass-strong mt-10 rounded-[2rem] p-7 md:p-10">
            <h2 className="font-display text-xl font-bold">What the client said</h2>
            <div className="mt-4 flex items-center gap-3">
              <Stars rating={post.client_rating} />
              <span className="text-sm font-semibold">{post.client_rating}.0 / 5</span>
            </div>
            {post.client_name && (
              <p className="mt-3 text-sm text-muted-foreground">— {post.client_name}</p>
            )}
          </section>
        )}

        <section className="glass-strong mt-12 rounded-[2.5rem] p-9 text-center md:p-12">
          <h2 className="font-display text-xl font-bold md:text-2xl">Like this style?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Tell us about your home and we'll suggest a plan that fits your space and budget.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <a
                href={whatsappLink(
                  `Hi ${SITE.shortName}, I liked your project "${post.title}". Can we discuss my home?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/contact">Send an enquiry</Link>
            </Button>
          </div>
        </section>
      </div>
    </article>
  );
}
