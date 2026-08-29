import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/dn-logo.png.asset.json";

const logo = logoAsset.url;
import { NAV_LINKS, SITE, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6 md:pt-5">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-3xl px-4 py-2.5 transition-all duration-500 md:px-6 ${
          scrolled ? "glass-strong" : "glass"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={logo} alt="DN Design Studio Home Interiors logo" width={32} height={40} className="h-10 w-auto" />
          <span className="font-display text-base font-bold leading-none tracking-tight md:text-lg">
            DN Design Studio
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-primary-soft text-primary" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
            <a
              href={whatsappLink(`Hi ${SITE.shortName}, I'd like a free consultation.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Free consultation
            </a>
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden">
          <div className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-foreground/85"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
