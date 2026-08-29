import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, string>();

/** Storage paths are stored in the DB; resolve them to viewable URLs. */
export async function resolveMedia(paths: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const missing: string[] = [];

  for (const p of paths) {
    if (!p) continue;
    if (/^https?:\/\//.test(p)) {
      out[p] = p;
    } else if (cache.has(p)) {
      out[p] = cache.get(p)!;
    } else {
      missing.push(p);
    }
  }

  if (missing.length) {
    const { data } = await supabase.storage.from("media").createSignedUrls(missing, 60 * 60 * 12);
    for (const item of data ?? []) {
      if (item.signedUrl && item.path) {
        cache.set(item.path, item.signedUrl);
        out[item.path] = item.signedUrl;
      }
    }
  }

  return out;
}

/** Downscale + re-encode an image in the browser before upload. */
export async function compressImage(file: File, maxSize = 1600, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality),
  );
  return blob ?? file;
}

export async function uploadMedia(file: File): Promise<string> {
  const blob = await compressImage(file);
  const path = `${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, blob, { contentType: "image/webp", upsert: false });
  if (error) throw error;
  return path;
}
