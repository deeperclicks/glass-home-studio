import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveMedia } from "./media";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  gallery: string[];
  is_project: boolean;
  featured: boolean;
  before_image: string | null;
  after_image: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  service: string;
  client_name: string;
  client_rating: number | null;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  images: string[];
  video_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export const postsQuery = (opts: { onlyPublished?: boolean } = {}) =>
  queryOptions({
    queryKey: ["posts", opts.onlyPublished ?? true],
    queryFn: async () => {
      let q = supabase.from("posts").select("*").order("sort_order").order("created_at", { ascending: false });
      if (opts.onlyPublished ?? true) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      const posts = (data ?? []) as Post[];
      const paths = posts.flatMap((p) =>
        [p.cover_image, p.before_image, p.after_image, ...p.gallery].filter(Boolean),
      ) as string[];
      const media = await resolveMedia(paths);
      return { posts, media };
    },
  });

export const reviewsQuery = (opts: { onlyPublished?: boolean } = {}) =>
  queryOptions({
    queryKey: ["reviews", opts.onlyPublished ?? true],
    queryFn: async () => {
      let q = supabase.from("reviews").select("*").order("sort_order").order("created_at", { ascending: false });
      if (opts.onlyPublished ?? true) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      const reviews = (data ?? []) as Review[];
      const media = await resolveMedia(reviews.flatMap((r) => r.images));
      return { reviews, media };
    },
  });

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
