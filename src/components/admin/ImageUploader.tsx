import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { uploadMedia, resolveMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";

export function ImageUploader({
  label,
  paths,
  onChange,
  multiple = false,
}: {
  label: string;
  paths: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
}) {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function refresh(next: string[]) {
    onChange(next);
    setPreviews(await resolveMedia(next));
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) uploaded.push(await uploadMedia(file));
      await refresh(multiple ? [...paths, ...uploaded] : uploaded.slice(0, 1));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={busy}
        onChange={(e) => onFiles(e.target.files)}
        className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary-soft file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary"
      />
      {busy && <p className="text-xs text-muted-foreground">Compressing &amp; uploading…</p>}
      {paths.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {paths.map((p) => (
            <div key={p} className="relative">
              {previews[p] ? (
                <img src={previews[p]} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-[10px] text-muted-foreground">
                  saved
                </div>
              )}
              <Button
                type="button"
                size="icon"
                variant="glass"
                className="absolute -right-2 -top-2 h-6 w-6"
                onClick={() => refresh(paths.filter((x) => x !== p))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
