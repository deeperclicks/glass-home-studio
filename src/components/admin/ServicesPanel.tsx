import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery, type ServiceRow } from "@/lib/services";
import { slugify } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "@/components/admin/ImageUploader";

const emptyForm = {
  name: "",
  tagline: "",
  description: "",
  price: "",
  image: [] as string[],
  published: true,
};

type Form = typeof emptyForm;

export function ServicesPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(servicesQuery({ onlyPublished: false }));
  const services = [...(data?.rows ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const [form, setForm] = useState<Form>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["services"] });

  function startEdit(row: ServiceRow) {
    setEditingId(row.id);
    setForm({
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      price: row.price,
      image: row.image ? [row.image] : [],
      published: row.published,
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Give the service a name");
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      price: form.price.trim(),
      image: form.image[0] ?? null,
      published: form.published,
    };

    const { error } = editingId
      ? await supabase.from("services").update(payload).eq("id", editingId)
      : await supabase.from("services").insert({
          ...payload,
          slug: `${slugify(form.name)}-${Date.now().toString(36).slice(-4)}`,
          sort_order: services.length,
        });

    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Service updated" : "Service added");
    cancelEdit();
    refresh();
  }

  async function move(row: ServiceRow, dir: -1 | 1) {
    const i = services.findIndex((s) => s.id === row.id);
    const j = i + dir;
    if (j < 0 || j >= services.length) return;
    await supabase.from("services").update({ sort_order: j }).eq("id", services[i]!.id);
    await supabase.from("services").update({ sort_order: i }).eq("id", services[j]!.id);
    refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (editingId === id) cancelEdit();
    refresh();
  }

  async function togglePublished(row: ServiceRow) {
    await supabase.from("services").update({ published: !row.published }).eq("id", row.id);
    refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={submit} className="glass-strong space-y-4 rounded-3xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">
            {editingId ? "Edit service" : "New service"}
          </h2>
          {editingId && (
            <Button type="button" size="sm" variant="glass" onClick={cancelEdit}>
              <X className="h-4 w-4" /> Cancel
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-name">Service name</Label>
          <Input
            id="s-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-tagline">One-line tagline</Label>
          <Input
            id="s-tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-desc">Description (2–3 lines)</Label>
          <Textarea
            id="s-desc"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-price">Price label (optional)</Label>
          <Input
            id="s-price"
            placeholder="from ₹15,000"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <ImageUploader
          label="Service image (shown on homepage & services page)"
          paths={form.image}
          onChange={(v) => setForm({ ...form, image: v })}
        />
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={form.published}
            onCheckedChange={(v) => setForm({ ...form, published: v === true })}
          />
          Published
        </label>
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          <Plus className="h-4 w-4" />
          {busy ? "Saving…" : editingId ? "Save changes" : "Add service"}
        </Button>
      </form>

      <div className="glass-strong space-y-3 rounded-3xl p-6">
        <h2 className="font-display text-lg font-bold">Order &amp; manage ({services.length})</h2>
        {services.length === 0 && (
          <p className="text-sm text-muted-foreground">No services yet.</p>
        )}
        {services.map((s) => (
          <div key={s.id} className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3">
            {s.image && data?.media[s.image] ? (
              <img src={data.media[s.image]} alt="" className="h-12 w-12 rounded-lg object-cover" />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{s.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {s.published ? "Published" : "Hidden"}
                {s.image ? " · Custom image" : " · Default image"}
              </p>
            </div>
            <Button size="icon" variant="glass" onClick={() => move(s, -1)} aria-label="Move up">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="glass" onClick={() => move(s, 1)} aria-label="Move down">
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="glass" onClick={() => startEdit(s)}>
              Edit
            </Button>
            <Button size="sm" variant="glass" onClick={() => togglePublished(s)}>
              {s.published ? "Hide" : "Show"}
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => remove(s.id)}
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
