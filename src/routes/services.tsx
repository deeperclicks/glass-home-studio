import { createFileRoute } from "@tanstack/react-router";
import { ServiceCard } from "@/components/ServiceCard";
import { TrustStrip } from "@/components/TrustStrip";
import { SERVICES, SITE, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Interior Design Services in Vijayawada | DN Design Studio" },
      {
        name: "description",
        content:
          "Full home 3D design from ₹15,000, modular kitchens, false ceilings, living and bedroom design, and end-to-end interiors in Vijayawada.",
      },
      { property: "og:title", content: "Interior Design Services in Vijayawada | DN Design Studio" },
      {
        property: "og:description",
        content:
          "Six ways we can help with your home — from photorealistic 3D design to complete end-to-end execution.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="px-4 pb-8 md:px-6">
      <section className="mx-auto max-w-3xl py-14 text-center md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">What we do</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
          Six ways we shape a home
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          Every project starts the same way — a conversation about how you actually live. From there
          you can take one room or hand us the whole house.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <ServiceCard key={s.slug} service={s} long />
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <TrustStrip />
      </section>

      <section className="glass-strong mx-auto mt-16 max-w-4xl rounded-[2.5rem] p-10 text-center md:p-14">
        <h2 className="font-display text-2xl font-bold md:text-3xl">Not sure where to start?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Send us your floor plan on WhatsApp. We'll tell you honestly what's worth doing first, and
          what can wait.
        </p>
        <Button asChild variant="hero" size="lg" className="mt-7">
          <a
            href={whatsappLink(`Hi ${SITE.shortName}, I'd like help choosing the right service.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp
          </a>
        </Button>
      </section>
    </div>
  );
}
