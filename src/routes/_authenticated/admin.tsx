import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, LogOut, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { postsQuery, reviewsQuery, slugify, type Post, type Review } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SERVICES } from "@/lib/site";
import { ServicesPanel } from "@/components/admin/ServicesPanel";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Studio Dashboard — DN Design Studio" },
      { name: "description", content: "Manage projects, reviews and enquiries." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Studio Dashboard — DN Design Studio" },
      { property: "og:description", content: "Manage projects, reviews and enquiries." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return setIsAdmin(false);
      const { data } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      setIsAdmin(Boolean(data));
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="canvas-gradient min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="glass-strong flex flex-wrap items-center justify-between gap-3 rounded-3xl px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-bold">Studio Dashboard</h1>
            <p className="text-xs text-muted-foreground">DN Design Studio Home Interiors</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="glass" size="sm">
              <Link to="/">View site</Link>
            </Button>
            <Button variant="glass" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>

        {isAdmin === false && (
          <div className="glass-strong mt-6 rounded-3xl p-8 text-center">
            <h2 className="font-display text-lg font-bold">No studio access on this account</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              If this is the studio's first account, claim owner access below. Otherwise ask the
              studio owner to add this email as an admin.
            </p>
            <Button
              variant="hero"
              className="mt-5"
              onClick={async () => {
                const { data, error } = await supabase.rpc("claim_studio_admin");
                if (error) {
                  toast.error(error.message);
                  return;
                }
                if (data) {
                  toast.success("Studio access granted");
                  setIsAdmin(true);
                } else {
                  toast.error("A studio owner already exists for this site.");
                }
              }}
            >
              Claim studio owner access
            </Button>
          </div>
        )}


        {isAdmin && (
          <Tabs defaultValue="projects" className="mt-6">
            <TabsList className="glass-strong rounded-full p-1">
              <TabsTrigger value="projects" className="rounded-full">
                Blog &amp; Our Work
              </TabsTrigger>
              <TabsTrigger value="services" className="rounded-full">
                Services
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-full">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="enquiries" className="rounded-full">
                Enquiries
              </TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="mt-6">
              <PostsPanel />
            </TabsContent>
            <TabsContent value="services" className="mt-6">
              <ServicesPanel />
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <ReviewsPanel />
            </TabsContent>
            <TabsContent value="enquiries" className="mt-6">
              <EnquiriesPanel />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Posts ------------------------------ */

const emptyPost = {
  title: "",
  excerpt: "",
  content: "",
  cover: [] as string[],
  gallery: [] as string[],
  before: [] as string[],
  after: [] as string[],
  service: "",
  clientName: "",
  clientRating: "",
  featured: false,
  isProject: true,
  published: true,
};

function PostsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(postsQuery({ onlyPublished: false }));
  const posts = data?.posts ?? [];
  const [form, setForm] = useState(emptyPost);
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["posts"] });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Give the project a title"); return; }
    setBusy(true);
    const { error } = await supabase.from("posts").insert({
      title: form.title.trim(),
      slug: `${slugify(form.title)}-${Date.now().toString(36).slice(-4)}`,
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      cover_image: form.cover[0] ?? null,
      gallery: form.gallery,
      before_image: form.before[0] ?? null,
      after_image: form.after[0] ?? null,
      service: form.service.trim(),
      client_name: form.clientName.trim(),
      client_rating: form.clientRating ? Number(form.clientRating) : null,
      featured: form.featured,
      is_project: form.isProject,
      published: form.published,
      sort_order: posts.length,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Published");
    setForm(emptyPost);
    refresh();
  }

  async function move(post: Post, dir: -1 | 1) {
    const ordered = [...posts].sort((a, b) => a.sort_order - b.sort_order);
    const i = ordered.findIndex((p) => p.id === post.id);
    const j = i + dir;
    if (j < 0 || j >= ordered.length) return;
    const a = ordered[i]!;
    const b = ordered[j]!;
    await supabase.from("posts").update({ sort_order: j }).eq("id", a.id);
    await supabase.from("posts").update({ sort_order: i }).eq("id", b.id);
    refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  async function togglePublished(post: Post) {
    await supabase.from("posts").update({ published: !post.published }).eq("id", post.id);
    refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={create} className="glass-strong space-y-4 rounded-3xl p-6">
        <h2 className="font-display text-lg font-bold">New post / project</h2>
        <div className="space-y-2">
          <Label htmlFor="p-title">Title</Label>
          <Input
            id="p-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-excerpt">Short excerpt</Label>
          <Input
            id="p-excerpt"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-service">Service delivered</Label>
          <select
            id="p-service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className="glass h-10 w-full rounded-xl px-3 text-sm"
          >
            <option value="">Select a service</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="p-client">Client name</Label>
            <Input
              id="p-client"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-rating">Client rating</Label>
            <select
              id="p-rating"
              value={form.clientRating}
              onChange={(e) => setForm({ ...form, clientRating: e.target.value })}
              className="glass h-10 w-full rounded-xl px-3 text-sm"
            >
              <option value="">No rating</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={String(r)}>
                  {r} ★
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-content">Story</Label>
          <Textarea
            id="p-content"
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>
        <ImageUploader
          label="Cover image"
          paths={form.cover}
          onChange={(v) => setForm({ ...form, cover: v })}
        />
        <ImageUploader
          label="Gallery images"
          multiple
          paths={form.gallery}
          onChange={(v) => setForm({ ...form, gallery: v })}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploader
            label="Before image (flagship)"
            paths={form.before}
            onChange={(v) => setForm({ ...form, before: v })}
          />
          <ImageUploader
            label="After image (flagship)"
            paths={form.after}
            onChange={(v) => setForm({ ...form, after: v })}
          />
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.isProject}
              onCheckedChange={(v) => setForm({ ...form, isProject: v === true })}
            />
            Show in Our Work
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.featured}
              onCheckedChange={(v) => setForm({ ...form, featured: v === true })}
            />
            Flagship (before/after)
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.published}
              onCheckedChange={(v) => setForm({ ...form, published: v === true })}
            />
            Published
          </label>
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          <Plus className="h-4 w-4" /> {busy ? "Publishing…" : "Publish"}
        </Button>
      </form>

      <div className="glass-strong space-y-3 rounded-3xl p-6">
        <h2 className="font-display text-lg font-bold">Order &amp; manage ({posts.length})</h2>
        {posts.length === 0 && <p className="text-sm text-muted-foreground">Nothing published yet.</p>}
        {[...posts]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((p) => (
            <div key={p.id} className="glass flex items-center gap-3 rounded-2xl p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {p.published ? "Published" : "Draft"}
                  {p.featured ? " · Flagship" : ""}
                  {p.is_project ? " · In Our Work" : ""}
                </p>
              </div>
              <Button size="icon" variant="glass" onClick={() => move(p, -1)} aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="glass" onClick={() => move(p, 1)} aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="glass" onClick={() => togglePublished(p)}>
                {p.published ? "Hide" : "Show"}
              </Button>
              <Button size="icon" variant="destructive" onClick={() => remove(p.id)} aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ----------------------------- Reviews ----------------------------- */

const emptyReview = { name: "", rating: 5, body: "", images: [] as string[], video: "" };

function ReviewsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(reviewsQuery({ onlyPublished: false }));
  const reviews = data?.reviews ?? [];
  const [form, setForm] = useState(emptyReview);
  const [busy, setBusy] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["reviews"] });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Add the reviewer's name"); return; }
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({
      name: form.name.trim(),
      rating: form.rating,
      body: form.body.trim(),
      images: form.images,
      video_url: form.video.trim() || null,
      sort_order: reviews.length,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Review published");
    setForm(emptyReview);
    refresh();
  }

  async function move(review: Review, dir: -1 | 1) {
    const ordered = [...reviews].sort((a, b) => a.sort_order - b.sort_order);
    const i = ordered.findIndex((r) => r.id === review.id);
    const j = i + dir;
    if (j < 0 || j >= ordered.length) return;
    await supabase.from("reviews").update({ sort_order: j }).eq("id", ordered[i]!.id);
    await supabase.from("reviews").update({ sort_order: i }).eq("id", ordered[j]!.id);
    refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={create} className="glass-strong space-y-4 rounded-3xl p-6">
        <h2 className="font-display text-lg font-bold">New review</h2>
        <div className="space-y-2">
          <Label htmlFor="r-name">Reviewer name</Label>
          <Input id="r-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="r-rating">Rating (1–5)</Label>
          <Input
            id="r-rating"
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="r-body">Review text</Label>
          <Textarea
            id="r-body"
            rows={4}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="r-video">Video embed URL (optional)</Label>
          <Input
            id="r-video"
            placeholder="https://www.youtube.com/embed/…"
            value={form.video}
            onChange={(e) => setForm({ ...form, video: e.target.value })}
          />
        </div>
        <ImageUploader
          label="Review images"
          multiple
          paths={form.images}
          onChange={(v) => setForm({ ...form, images: v })}
        />
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          <Plus className="h-4 w-4" /> {busy ? "Publishing…" : "Publish review"}
        </Button>
      </form>

      <div className="glass-strong space-y-3 rounded-3xl p-6">
        <h2 className="font-display text-lg font-bold">Order &amp; manage ({reviews.length})</h2>
        {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
        {[...reviews]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((r) => (
            <div key={r.id} className="glass flex items-center gap-3 rounded-2xl p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {r.name} · {r.rating}★
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{r.body}</p>
              </div>
              <Button size="icon" variant="glass" onClick={() => move(r, -1)} aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="glass" onClick={() => move(r, 1)} aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => remove(r.id)} aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ---------------------------- Enquiries ---------------------------- */

function EnquiriesPanel() {
  const { data } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="glass-strong space-y-3 rounded-3xl p-6">
      <h2 className="font-display text-lg font-bold">Enquiries ({data?.length ?? 0})</h2>
      {(data ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">No enquiries yet.</p>
      )}
      {(data ?? []).map((e) => (
        <div key={e.id} className="glass rounded-2xl p-4 text-sm">
          <p className="font-semibold">
            {e.name} · {e.phone} · {e.city}
          </p>
          <p className="mt-1 text-muted-foreground">
            {e.service} · ₹{Number(e.budget).toLocaleString("en-IN")}
          </p>
          {e.message && <p className="mt-2 text-foreground/80">{e.message}</p>}
          <p className="mt-2 text-[11px] text-muted-foreground">
            {new Date(e.created_at).toLocaleString("en-IN")}
          </p>
        </div>
      ))}
    </div>
  );
}
