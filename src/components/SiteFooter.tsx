import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone } from "lucide-react";
import logoAsset from "@/assets/dn-logo.png.asset.json";
import { SITE } from "@/lib/site";

const logo = logoAsset.url;

export function SiteFooter() {
  return (
  <footer className="mt-24 px-4 pb-8 md:px-6">
      <div className="glass-strong group mx-auto max-w-6xl rounded-[2.5rem] p-8 md:p-12">
        <div className="wordmark-shimmer font-display text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-[0.9] tracking-tight">
          {SITE.name}
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary transition-transform hover:-translate-y-0.5"
            >
              <Instagram className="h-5 w-5" />
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
                <a
                  href="https://www.google.com/maps/place/DN+Design+Studio+Home+Interiors/@16.4961146,80.6586827,17z/data=!4m9!1m2!29m1!1b1!3m5!1s0x3a35fb4fa47247bf:0xda44b10b8e917e2e!8m2!3d16.4961146!4d80.6634463!16s%2Fg%2F11x2590ff0?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  <MapPin className="h-4 w-4" /> Locate us
                </a>
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
