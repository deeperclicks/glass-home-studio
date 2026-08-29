import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  city: z.string().trim().min(2, "Please enter your city").max(60),
  service: z.string().trim().min(2, "Please choose a service").max(80),
  budget: z.number().int().min(5000).max(100000),
  message: z.string().trim().max(1000).default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please tick the consent box" }) }),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      phone: data.phone,
      city: data.city,
      service: data.service,
      budget: data.budget,
      message: data.message,
      consent: data.consent,
    });
    if (error) {
      console.error("enquiry insert failed", error.message);
      throw new Error("We couldn't save your enquiry. Please try WhatsApp instead.");
    }

    let emailed = false;
    const resendKey = process.env["RESEND_API_KEY"];
    if (resendKey) {
      try {
        const budgetLabel =
          data.budget >= 100000 ? "₹1,00,000+" : `₹${data.budget.toLocaleString("en-IN")}`;
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "DN Design Studio <onboarding@resend.dev>",
            to: ["dndesignstudio.vja@gmail.com"],
            reply_to: undefined,
            subject: `New enquiry — ${data.name} (${data.service})`,
            text: [
              `Name: ${data.name}`,
              `Phone: ${data.phone}`,
              `City: ${data.city}`,
              `Service needed: ${data.service}`,
              `Budget: ${budgetLabel}`,
              `Message: ${data.message || "—"}`,
            ].join("\n"),
          }),
        });
        emailed = res.ok;
        if (!res.ok) console.error("resend failed", res.status, await res.text());
      } catch (err) {
        console.error("resend error", err);
      }
    }

    return { ok: true as const, emailed };
  });
