import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/studio-login")({
  head: () => ({
    meta: [
      { title: "Studio Login — DN Design Studio" },
      { name: "description", content: "Private sign-in for the DN Design Studio team." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Studio Login — DN Design Studio" },
      { property: "og:description", content: "Private sign-in for the DN Design Studio team." },
      { property: "og:url", content: "/studio-login" },
    ],
    links: [{ rel: "canonical", href: "/studio-login" }],
  }),
  component: StudioLogin,
});

function StudioLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/studio-login` },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. Sign in to open the dashboard.");
      setMode("signin");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="glass-strong w-full max-w-md rounded-[2.5rem] p-9">
        <h1 className="font-display text-2xl font-bold">
          {mode === "signin" ? "Studio Login" : "Create studio account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          For the DN Design Studio team only.
        </p>
        <form onSubmit={onSubmit} className="mt-7 space-y-4">

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
