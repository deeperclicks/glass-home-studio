import { Button } from "@/components/ui/button";
import { whatsappLink, type Service } from "@/lib/site";

export function ServiceCard({ service, long = false }: { service: Service; long?: boolean }) {
  return (
    <article className="glass-tint group flex h-full flex-col overflow-hidden rounded-[2rem] transition-transform duration-500 hover:-translate-y-1.5">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          width={1024}
          height={768}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {service.price && (
          <span className="glass-strong absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold text-primary">
            {service.price}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold leading-snug">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {long ? service.description : service.tagline}
        </p>
        <Button asChild variant="whatsapp" className="mt-5 w-full">
          <a
            href={whatsappLink(`Hi, I'm interested in ${service.name}`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire on WhatsApp
          </a>
        </Button>
      </div>
    </article>
  );
}
