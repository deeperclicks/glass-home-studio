import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICES, SITE, whatsappLink } from "@/lib/site";
import { contactSchema, submitEnquiry } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact DN Design Studio — Interior Designers in Vijayawada" },
      {
        name: "description",
        content:
          "Tell us about your home and we'll reply on WhatsApp. Call +91 88010 68392 or send an enquiry to DN Design Studio Home Interiors, Vijayawada.",
      },
      { property: "og:title", content: "Contact DN Design Studio — Vijayawada" },
      {
        property: "og:description",
        content: "Share your plan and budget, and we'll come back with honest, practical advice.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const send = useServerFn(submitEnquiry);
  const [budget, setBudget] = useState<string>("25000");
  const [service, setService] = useState(SERVICES[0]!.name);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      city: String(fd.get("city") ?? ""),
      service,
      budget: Number(budget || 0),
      message: String(fd.get("message") ?? ""),
      consent,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await send({ data: parsed.data });
      const summary = [
        `New enquiry from ${parsed.data.name}`,
        `Phone: ${parsed.data.phone}`,
        `City: ${parsed.data.city}`,
        `Service: ${parsed.data.service}`,
        `Budget: ₹${parsed.data.budget.toLocaleString("en-IN")}`,
        parsed.data.message ? `Note: ${parsed.data.message}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      setDone(true);
      window.open(whatsappLink(summary), "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-4 pb-8 md:px-6">
      <section className="mx-auto max-w-3xl py-14 text-center md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Contact us</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] md:text-5xl">
          Let's talk about <em>your home</em>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          Fill this in and we'll continue the conversation on WhatsApp — usually the same day.
        </p>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className="glass-strong rounded-[2.5rem] p-7 md:p-10">
          {done ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="h-14 w-14 text-primary" />
              <h2 className="mt-5 font-display text-xl font-bold">Thank you — we've got it</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Your enquiry is saved and sent to our studio inbox. A WhatsApp chat should have opened
                with your details — send it and we'll reply there.
              </p>
              <Button variant="glass" className="mt-7" onClick={() => setDone(false)}>
                Send another enquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" maxLength={80} placeholder="Your full name" required />
                  {errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={20}
                    placeholder="+91 …"
                    required
                  />
                  {errors["phone"] && <p className="text-xs text-destructive">{errors["phone"]}</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" maxLength={60} placeholder="Vijayawada" required />
                  {errors["city"] && <p className="text-xs text-destructive">{errors["city"]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service needed</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.slug} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Your budget (₹)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  min={1000}
                  step={1000}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter amount, e.g. 250000"
                  required
                />
                {errors["budget"] && <p className="text-xs text-destructive">{errors["budget"]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Anything to say (optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  placeholder="Flat size, possession date, rooms you'd like to start with…"
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-0.5"
                />
                <span>I agree to be contacted about my enquiry</span>
              </label>
              {errors["consent"] && <p className="text-xs text-destructive">{errors["consent"]}</p>}

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
                {busy ? "Sending…" : "Send enquiry & open WhatsApp"}
              </Button>
            </form>
          )}
        </section>

        <aside className="space-y-6">
          <div className="glass-tint rounded-[2rem] p-7">
            <h2 className="font-display text-lg font-bold">Reach us directly</h2>
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
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" /> {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {SITE.addressLine}
              </li>
            </ul>
            <Button asChild variant="whatsapp" className="mt-6 w-full">
              <a
                href={whatsappLink(`Hi ${SITE.shortName}, I'd like to discuss my home interiors.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </Button>
          </div>

          <div className="glass overflow-hidden rounded-[2rem] p-2">
            <iframe
              title="DN Design Studio location in Vijayawada"
              src="https://www.google.com/maps?q=Vijayawada%2C%20Andhra%20Pradesh&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full rounded-[1.6rem] border-0"
            />
          </div>
          <Button asChild variant="outline" className="w-full">
            <a
              href="https://www.google.com/maps/place/DN+Design+Studio+Home+Interiors/@16.4961146,80.6585754,17z/data=!4m6!3m5!1s0x3a35fb4fa47247bf:0xda44b10b8e917e2e!8m2!3d16.4961146!4d80.6634463!16s%2Fg%2F11x2590ff0?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </Button>
        </aside>
      </div>
    </div>
  );
}
