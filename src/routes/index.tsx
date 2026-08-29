import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { TrustStrip } from "@/components/TrustStrip";
import { ReviewsPreview } from "@/components/ReviewsPreview";
import { SERVICES, SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DN Design Studio — Interior Designers in Vijayawada" },
      {
        name: "description",
        content:
          "Boutique interior design studio in Vijayawada. Full home 3D design from ₹15,000, modular kitchens, false ceilings and end-to-end interiors. 4.9★ from 65+ reviews.",
      },
      { property: "og:title", content: "DN Design Studio — Interior Designers in Vijayawada" },
      {
        property: "og:description",
        content:
          "Full home 3D design from ₹15,000, modular kitchens and end-to-end interiors, designed and built in Vijayawada.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="px-4 pb-10 md:px-6">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr]">
        <div className="rise">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Interior studio · {SITE.city}
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.03] md:text-6xl">
            Homes designed in <span className="text-gradient">3D</span> before a single
            nail goes in
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {SITE.name} is a boutique studio designing and building warm, practical homes across{" "}
            {SITE.city}. See every room rendered first, agree on it, then watch us build it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <a
                href={whatsappLink(
                  "Hi DN Design Studio, I'm interested in Full Home 3D Design Services starting at ₹15,000. Please share the details.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Full Home 3D Design — from ₹15,000
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/our-work">See our work</Link>
            </Button>
          </div>
          <div className="mt-9">
            <TrustStrip />
          </div>
        </div>

        <div className="glass-strong rise overflow-hidden rounded-[2.5rem] p-3">
          <img
            src={heroImage}
            alt="Warm modern living room interior designed by DN Design Studio in Vijayawada"
            className="h-[380px] w-full rounded-[2rem] object-cover md:h-[520px]"
            loading="eager"
          />
        </div>
      </section>

      {/* Services carousel */}
      <section className="mx-auto max-w-6xl py-10 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">What we do</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
              Six ways we shape a home
            </h2>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="glass" onClick={() => scrollBy(-1)} aria-label="Previous services">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="glass" onClick={() => scrollBy(1)} aria-label="Next services">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map((service) => (
            <div
              key={service.slug}
              className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[calc(33.333%-0.9rem)]"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button asChild variant="glass">
            <Link to="/services">
              All services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-5xl py-12 md:py-20">
        <div className="glass-strong rounded-[2.5rem] px-7 py-12 text-center md:px-14 md:py-16">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Tell us about your home
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Share your floor plan, your budget and how you like to live. We'll come back with honest,
            practical advice — no pressure, no jargon.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="whatsapp" size="lg">
              <a
                href={whatsappLink(
                  `Hi ${SITE.shortName}, I'd like to talk about designing my home.`,
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
        </div>
      </section>
    </div>
  );
}
