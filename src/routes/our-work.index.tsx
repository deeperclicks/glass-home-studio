import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BeforeAfter } from "@/components/BeforeAfter";
import { postsQuery } from "@/lib/content";
import { SITE, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/our-work/")({
  head: () => ({
    meta: [
      { title: "Our Work — Interior Projects in Vijayawada | DN Design Studio" },
      {
        name: "description",
        content:
          "Recent homes designed and executed by DN Design Studio in Vijayawada — living rooms, kitchens, bedrooms and complete home interiors.",
      },
      { property: "og:title", content: "Our Work — Interior Projects in Vijayawada" },
      {
        property: "og:description",
        content: "A look inside recent homes we've designed and built in and around Vijayawada.",
      },
      { property: "og:url", content: "/our-work" },
    ],
    links: [{ rel: "canonical", href: "/our-work" }],
  }),
  component: OurWorkPage,
});

function OurWorkPage() {
  const { data, isLoading } = useQuery(postsQuery());
  const posts = (data?.posts ?? []).filter((p) => p.is_project);
  const media = data?.media ?? {};

  return (
    <div className="px-4 pb-8 md:px-6">
      <section className="mx-auto max-w-3xl py-14 text-center md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Our work</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] md:text-5xl">
          Homes we've <em>handed over</em>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          Real projects, real families, photographed after handover. Drag the flagship projects to see
          where they started.
        </p>
      </section>

      {isLoading && (
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass h-80 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="glass-strong mx-auto max-w-2xl rounded-[2rem] p-10 text-center">
          <h2 className="font-display text-xl font-bold">Project gallery coming soon</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We're photographing our latest handovers. In the meantime, message us and we'll send
            recent work directly.
          </p>
          <Button asChild variant="whatsapp" className="mt-6">
            <a
              href={whatsappLink(`Hi ${SITE.shortName}, can you share some recent projects?`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask for recent projects
            </a>
          </Button>
        </div>
      )}

      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {posts.map((p) => {
            const cover = p.cover_image ? media[p.cover_image] : undefined;
            const before = p.before_image ? media[p.before_image] : undefined;
            const after = p.after_image ? media[p.after_image] : undefined;
            const isSlider = Boolean(p.featured && before && after);

            return (
              <article
                key={p.id}
                className="glass-tint group break-inside-avoid overflow-hidden rounded-[2rem] transition-transform duration-500 hover:-translate-y-1.5"
              >
                {isSlider ? (
                  <BeforeAfter before={before!} after={after!} alt={p.title} />
                ) : cover ? (
                  <img
                    src={cover}
                    alt={p.title}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="p-6">
                  {p.featured && (
                    <span className="mb-2 inline-block rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      Flagship project
                    </span>
                  )}
                  <h2 className="font-display text-lg font-bold leading-snug">{p.title}</h2>
                  {p.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      <section className="glass-strong mx-auto mt-16 max-w-4xl rounded-[2.5rem] p-10 text-center md:p-14">
        <h2 className="font-display text-xl font-bold md:text-2xl">Want your home in here?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Tell us a little about your space and we'll come back with ideas — no obligation.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero" size="lg">
            <a
              href={whatsappLink(`Hi ${SITE.shortName}, I saw your work and I'd like to discuss my home.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start on WhatsApp
            </a>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link to="/contact">Send an enquiry</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
