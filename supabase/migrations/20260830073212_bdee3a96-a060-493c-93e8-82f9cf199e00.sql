CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  image text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "published services are public" ON public.services
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins read all services" ON public.services
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins insert services" ON public.services
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins update services" ON public.services
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins delete services" ON public.services
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.services (slug, name, tagline, description, price, sort_order) VALUES
('full-home-3d-design','Full Home 3D Design Services','See your entire home in photorealistic 3D before construction begins.','Walk through your future home in photorealistic 3D before construction starts. We model your actual floor plan and real lighting so you can refine every detail early. Most families finalise the whole design in just two or three review rounds.','from ₹15,000',1),
('full-home-interiors','Full Home Interiors','Complete design and execution for your whole home, start to finish.','One studio handles layout, joinery, finishes, furniture and site work for your entire home. Every room is designed as part of a single, cohesive vision. You get a considered home, not an assembled one.','',2),
('modular-kitchen','Modular Kitchen','Smart, space-efficient kitchens built around how you cook and live.','Indian kitchens built for real daily cooking — deep pull-outs, smart ventilation and durable hardware. Every storage detail is drawn around your utensils and workflow. Designed to survive tempering, grinding and everyday chaos.','',3),
('modern-living-bedroom-designing','Modern Living & Bedroom Designing','Contemporary living rooms and bedrooms designed around your daily life.','Living rooms and bedrooms designed for both lively family time and quiet rest. Warm palettes, hidden storage and layered lighting set the mood. Spaces that adapt to your day and night.','',4),
('fall-ceiling-lighting','Fall Ceiling & Lighting','Custom ceilings and layered lighting that transform any room''s mood.','Custom ceiling profiles, coves and pelmets tailored to your room height. We layer ambient, task and accent lighting so the same space feels bright by morning and soft after dark. Wiring and dimming are planned with the design, never after it.','',5),
('end-to-end-interiors','End-to-End Interiors','One team, one point of contact, from first sketch to final handover.','Design, procurement, carpentry, electrical, painting and styling under one accountable team. We share schedules, site updates and clear timelines throughout. Move into a clean, tested home without chasing multiple vendors.','',6);