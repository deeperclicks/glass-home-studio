import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { HomeCursor } from "@/components/HomeCursor";
import { IntroOverlay } from "@/components/IntroOverlay";
import { RouteLoader } from "@/components/RouteLoader";
import { ColumnGridOverlay } from "@/components/ColumnGridOverlay";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-[2rem] p-10 text-center">
        <h1 className="font-display text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">This room doesn't exist</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has moved or was never built.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-[2rem] p-10 text-center">
        <h1 className="font-display text-xl font-bold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try again, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input px-5 py-2.5 text-sm font-semibold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DN Design Studio Home Interiors | Vijayawada" },
      {
        name: "description",
        content:
          "Boutique interior design studio in Vijayawada. Full home 3D design from ₹15,000, modular kitchens, false ceilings and end-to-end interiors.",
      },
      { name: "author", content: SITE.name },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#ea585d" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,100;1,9..144,300..900,100&family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://dndesignstudio.example/#studio",
          name: SITE.name,
          image: "https://dndesignstudio.example/favicon.png",
          description:
            "Interior design studio in Vijayawada offering full home 3D design, modular kitchens, false ceilings and end-to-end interiors.",
          telephone: SITE.phonePrimary,
          email: SITE.email,
          priceRange: "₹₹",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Vijayawada",
            addressRegion: "Andhra Pradesh",
            postalCode: "520010",
            addressCountry: "IN",
          },
          geo: { "@type": "GeoCoordinates", latitude: 16.5062, longitude: 80.648 },
          sameAs: [SITE.instagram],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: SITE.rating,
            reviewCount: SITE.reviewCount,
            bestRating: 5,
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="canvas-gradient relative min-h-screen bg-fixed">
        <ColumnGridOverlay />
        <div className="relative z-10">
          <IntroOverlay />
          <RouteLoader />
          <HomeCursor />
          {!isAdmin && <SiteHeader />}
          <main className={isAdmin ? "" : "pt-24 md:pt-28"}>
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          {!isAdmin && <SiteFooter />}
          {!isAdmin && <WhatsAppFab />}
          <Toaster position="top-center" richColors />
        </div>
      </div>
    </QueryClientProvider>
  );
}
