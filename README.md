# Glass Home Studio

Build a premium, animated website for DN Design Studio Home Interiors, an interior design studio in Vijayawada, Andhra Pradesh. The site should use a modern liquid glass (glassmorphism) visual language, be entirely WhatsApp-lead-driven, and include a working admin dashboard for the client to manage content themselves.

1. Brand & Business Info
Business name: DN Design Studio Home Interiors
Location: Vijayawada, Andhra Pradesh
Phone numbers: +91 88010 68392 (primary/WhatsApp), +91 9381350660 (secondary)
Email (for form submissions): dndesignstudio.vja@gmail.com
Instagram: https://www.instagram.com/dn_designstudio.vja
Rating: 4.9★ from 65+ Google reviews
Logo: client-provided, used in header and footer
2. Design System
Primary color: 
#ea585d (warm coral-red)
Background: soft gradient from off-white/whitish tones into 
#ea585d, used behind hero and key sections — never so strong that it fights with text
Style: liquid glass / glassmorphism — frosted, semi-transparent panels with soft blur and subtle borders for cards, nav bar, and buttons, floating over the gradient background
Contrast rule: glass panels must always sit over a solid or blurred backdrop, never directly over busy imagery with no blur — body text must stay clearly legible at all times
Typography: clean modern sans-serif for body text, a slightly bolder/rounder display font for headings
Custom cursor: a small home-icon cursor with a soft drop shadow, replacing the default pointer on desktop only — automatically fall back to the normal cursor/pointer on touch devices (phones/tablets), since a custom cursor has no meaning there
3. Entry Animation
On every page load, play a short intro animation before the homepage renders:
A sofa icon draws/fades in
A home icon appears alongside or after it
The text "DN Design Studio" fades/slides in beneath the icons
The whole intro dissolves or wipes away to reveal the hero section
Keep total duration short (around 2 seconds) so it feels like a designed reveal, not a delay
4. Inter-Page Loading Animation
Play a 1.5 second branded loading animation during full page/route transitions (e.g. Home → Services, Home → Our Work)
Do NOT trigger this loader for small in-page interactions (opening a modal, hovering, form field focus, accordion toggles) — only for actual navigation between pages, or it will feel sluggish
5. Homepage Structure

Hero Section

Gradient background (whitish → 
#ea585d), glass-panel nav bar
Headline + short supporting line
Featured callout: "Full Home 3D Design Services — starting at ₹15,000" with a button that opens WhatsApp directly: https://wa.me/918801068392?text=Hi%2C%20I%27m%20interested%20in%20Full%20Home%203D%20Design%20Services

6-Image Service Slider Directly below the hero, a sliding/carousel section with 6 images, each paired with a short line of text and a WhatsApp button for that specific service, in this exact order. Pre-fill each WhatsApp message with the service name so the client knows what the lead wants before replying:

Full Home 3D Design Services (from ₹15,000) — "See your entire home in photorealistic 3D before construction begins."
Full Home Interiors — "Complete design and execution for your whole home, start to finish."
Modular Kitchen — "Smart, space-efficient kitchens built around how you cook and live."
Modern Living & Bedroom Designing — "Contemporary living rooms and bedrooms designed around your daily life."
Fall Ceiling & Lighting — "Custom ceilings and layered lighting that transform any room's mood."
End-to-End Interiors — "One team, one point of contact, from first sketch to final handover."

Each button links to https://wa.me/918801068392?text= + that service's name, URL-encoded.

Trust Strip

"4.9★ · 65+ Google Reviews · Trusted Interior Studio in Vijayawada"
6. Services Page

Full section/page listing all 6 services above, each with a slightly longer, pleasant description (2–3 sentences), a representative image, and its own WhatsApp CTA button.

7. Our Work (Portfolio) — powered by the blog
"Our Work" is populated automatically from blog posts the admin publishes — each blog post (with its images) becomes a project entry here. Build this as one shared data model: blog posts tagged as projects flow straight into this section, not a separate manually-maintained list.
Grid/masonry layout of project cards (cover image, title, short excerpt)
For 2–3 flagship/featured projects, use a before/after image slider (drag to reveal) instead of a static image
Admin can manually reorder how these project cards appear (see Admin Dashboard below)
8. Reviews Page
Card layout: reviewer name, star rating, review text, optional review image(s)
Reviews are written and managed by the admin (with images) and appear here automatically — same shared-data-model approach as the blog/portfolio link
Include 1–2 embedded video testimonials alongside the written ones (client has short video reviews from Google — use those)
"See all reviews on Google" link/button
9. Contact Us Section

Form fields:

Name
Phone Number
City
Service Needed (dropdown, using the 6 services above)
Budget Range — slider or range input, min ₹5,000, max ₹100,000+ (open-ended top)
Anything to say (free text, optional)
A small consent checkbox: "I agree to be contacted about my enquiry" (required to submit)

On submit:

Save the entry to the database
Send an email with all details to dndesignstudio.vja@gmail.com
Also open a WhatsApp deep link to +91 88010 68392 with the submitted details pre-filled as the message, so the client can respond on WhatsApp immediately
Show a clear success confirmation after submission
10. Admin Dashboard
Real authentication required (Supabase Auth — email/password login), not a fake/hardcoded login
Entry point: a small, unobtrusive "Studio Login" link in the footer — not in the main navigation
Once logged in, the admin (client) can:
Write and publish blog posts with images (these auto-populate "Our Work")
Reorder the project cards shown in "Our Work"
Write and publish reviews with images (these auto-populate the Reviews page)
Uploaded images should be compressed/resized automatically on upload so page speed doesn't degrade over time as the client adds content from their phone
11. Footer
Client's logo, with a smooth enlarge/scale-up effect on hover
Instagram link (https://www.instagram.com/dn_designstudio.vja)
Both phone numbers: +91 88010 68392 and +91 9381350660
Quick nav links, address/service area
Small "Studio Login" link for admin access
Persistent floating WhatsApp button visible on every page (bottom corner), separate from the footer, for quick contact from anywhere on the site
12. SEO & Sharing
LocalBusiness schema markup (name, address, phone, rating)
Embedded Google Maps pin near the contact section
Open Graph tags with a proper preview image and description, since links will be shared on Instagram and WhatsApp
13. Technical Notes
Use Supabase for: authentication (admin login), database (blog posts, reviews, form submissions, project ordering), and storage (uploaded images)
Use an email-sending integration (e.g. Resend via a Supabase Edge Function) triggered on new contact-form submissions
Fully responsive, mobile-first — most traffic will arrive via Instagram/WhatsApp links on phones
Lazy-load all images, especially in the homepage slider and portfolio grid
14. Tone of Voice

Warm, confident, and personal throughout all copy — a boutique studio that genuinely cares about each home, not a mass-production contractor.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a2f1d0e-3e26-498b-a3a2-e1c1b163bea8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
