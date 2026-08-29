import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/dn-logo.png";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 px-4 pb-8 md:px-6">
      <div className="glass-strong mx-auto max-w-6xl rounded-[2.5rem] p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <img
              src={logo}
              alt="DN Design Studio Home Interiors logo"
              width={72}
              height={72}
              loading="lazy"
              className="h-16 w-16 origin-left transition-transform duration-500 ease-out hover:scale-125"
            />
            <h2 className="mt-4 font-display text-xl font-bold">{SITE.name}</h2>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
            >
              <Instagram className="h-4 w-4" /> @dn_designstudio.vja
            </a>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground/70">
              Talk to us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a href={`tel:+${SITE.phonePrimaryRaw}`} className="inline-flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" /> {SITE.phonePrimary}
                </a>
              </li>
              <li>
                <a href={`tel:+${SITE.phoneSecondaryRaw}`} className="inline-flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" /> {SITE.phoneSecondary}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" /> {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {SITE.addressLine}
                  <br />
                  Serving Vijayawada, Guntur, Mangalagiri &amp; Amaravati
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <Link to="/studio-login" className="opacity-60 transition-opacity hover:text-primary hover:opacity-100">
            Studio Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
