import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveMedia } from "./media";
import { SERVICES, type Service } from "./site";

export type ServiceRow = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: string;
  image: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

/** Bundled fallback artwork, used when a service row has no uploaded image. */
const FALLBACK_IMAGES: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s.image]),
);

export const servicesQuery = (opts: { onlyPublished?: boolean } = {}) =>
  queryOptions({
    queryKey: ["services", opts.onlyPublished ?? true],
    queryFn: async () => {
      let q = supabase
        .from("services")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: true });
      if (opts.onlyPublished ?? true) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as ServiceRow[];
      const media = await resolveMedia(rows.map((r) => r.image).filter(Boolean) as string[]);
      return { rows, media };
    },
  });

export function toService(row: ServiceRow, media: Record<string, string>): Service {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    ...(row.price ? { price: row.price } : {}),
    image: (row.image ? media[row.image] : undefined) ?? FALLBACK_IMAGES[row.slug] ?? SERVICES[0]!.image,
  };
}

/** Live services for public pages, falling back to bundled defaults before data loads. */
export function useServices(): Service[] {
  const { data } = useQuery(servicesQuery());
  if (!data) return SERVICES;
  if (data.rows.length === 0) return SERVICES;
  return data.rows.map((r) => toService(r, data.media));
}
