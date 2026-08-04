# PLAN.md — Farid Maleki Portfolio: Master Build & Deploy Plan

Single source of truth for building this in Cursor and shipping to `faridmaleki.github.io`.
Supersedes the original sprint list — same structure, now with real decisions, real content,
and copy-paste Cursor prompts for every v1 sprint.

---

## 0. Status — what's decided, what's built, what's still open

**Decided:**
- Stack: Next.js 15 (App Router) + TypeScript + TailwindCSS + shadcn/ui, static export for GitHub Pages
- Domain: `faridmaleki.github.io` for v1 (custom domain later — see §5.4)
- Contact: direct email/LinkedIn/GitHub links only, no form/backend for v1
- Branding: dark-slate palette, Space Grotesk/Inter/JetBrains Mono, CSS-variable tokens (themeable)
- Confidentiality: employer projects (MCI, Rightel, Robin, Procycons, Eastern Pharma) → outcomes/
  percentages only, no raw screenshots/infra specifics; one personal GitHub repo gets full detail
- Resume: single source of truth is `data/*.json`; PDF auto-generated via CI (v2 — see §3)
- Leadership philosophy: "tree" milestone model + people-first task assignment (drafted)

**Already built (in `/portfolio-starter`):**
```
docs/
  00-project-vision.md        Vision, audience, sitemap
  01-branding.md              Palette, typography, logo direction
  04-about-page.md            About-page spec + philosophy (SOLID, design patterns, clean code)
  07-project-page.md          Case-study page spec + gallery empty-state requirement
  09-resume-generation.md     Auto-gen CV pipeline spec
  10-leadership.md            Leadership page spec + testimonials stub
  12-contact-deployment.md    Contact + domain decisions
  OPEN-QUESTIONS.md           Remaining content gaps
  architecture/*.mermaid      5 architecture diagrams (call center, anomaly detection,
                               matching/recommendation, ESG pipeline, EviPackAI RAG)
data/
  resume.json, experience.json, skills.json, certificates.json,
  publications.json, projects.json, open-source.json
content/
  about-story.md              Full About narrative (polished, ready to use)
```

**Still open (doesn't block starting Sprints 1–7):**
- Shorter "elevator" version of the About story (2–3 paragraphs) for the hero/summary block
- `problem` / `lessonsLearned` fields per case study in `data/projects.json`
- Featured open-source repo pick (from `github.com/faridjb`) for the full-detail case study
- 2–4 real ADPlist testimonial quotes for `data/testimonials.json`

None of these block Cursor from starting. Build with placeholders, swap content in later — the
whole point of the JSON-driven structure is that content updates don't touch component code.

---

## 1. Repository structure (final)

```
faridmaleki.github.io/
  .github/workflows/deploy.yml
  app/
    layout.tsx
    page.tsx                  Home
    about/page.tsx
    experience/page.tsx
    projects/page.tsx
    projects/[id]/page.tsx
    architecture/page.tsx
    resume/page.tsx
    leadership/page.tsx
    open-source/page.tsx
    contact/page.tsx
  components/
    ui/                       shadcn primitives
    Navbar.tsx  Footer.tsx  ProjectCard.tsx  Timeline.tsx
    Gallery.tsx (empty-state aware)  ArchitectureDiagram.tsx (mermaid renderer)
    TechBadge.tsx  SkillMatrix.tsx  ThemeToggle.tsx
  content/
    about-story.md
  data/
    resume.json  experience.json  skills.json  certificates.json
    publications.json  projects.json  open-source.json  testimonials.json (TODO)
  docs/                        (planning docs — not shipped, reference only)
    architecture/*.mermaid
  public/
    images/  documents/resume.pdf (generated, v2)
  next.config.js
  tailwind.config.ts
  package.json
```

---

## 2. Roadmap: v1 (ship this first) vs v2 (after launch)

**v1 — get a live, credible site in front of recruiters:**
Sprint 1 (repo setup) → 2 (design system) → 3 (home) → 4 (about) → 5 (experience) →
6 (projects) → 7 (architecture) → 12 (contact) → 13 (SEO) → 15 (deploy)

**v2 — depth and polish, after v1 is live:**
Sprint 8 (blog), 9 (resume auto-gen PDF pipeline — static resume page ships in v1, the CI/PDF
automation is v2), 10 (leadership), 11 (open source auto-fetch), 14 (performance tuning)

Reasoning: a live site with Home/About/Experience/Projects/Contact does the actual job — getting
a CTO or recruiter to a credible page fast — sooner than a fully-featured 15-sprint build would.

---

## 3. Cursor prompts — v1, step by step

Run these in order. Each assumes Cursor has the repo open with `/portfolio-starter/docs` and
`/portfolio-starter/data` copied into the project root's `docs/` and `data/` folders first.

### Sprint 1 — Repository setup
```
Initialize a Next.js 15 project using the App Router with TypeScript, TailwindCSS, and ESLint.
Configure it for static export (output: 'export' in next.config.js) since this will deploy to
GitHub Pages with no server runtime. Install shadcn/ui and Framer Motion. Set up Prettier with
a standard config. Do not create any pages yet — just the skeleton, config, and tooling.
```

### Sprint 2 — Design system
```
Read docs/01-branding.md. Implement the color palette as CSS variables in globals.css (not
hardcoded hex in components), map them into tailwind.config.ts as theme colors, and set up
Space Grotesk (headings), Inter (body), and JetBrains Mono (code/labels) via next/font.
Build a light/dark theme toggle using CSS variables so the whole palette can be swapped later
by editing one file. Then build these reusable components with shadcn/ui primitives where
sensible: Navbar, Footer, Button variants, Card, Badge (for tech stack tags), Timeline item,
ThemeToggle. No page-specific code yet.
```

### Sprint 3 — Home page
```
Read docs/00-project-vision.md for the value proposition and audience. Build the home page
(app/page.tsx) with these sections in order: Hero (name, title, tagline, CTA to Projects and
Resume download), Featured Projects (pull top 3 from data/projects.json, excluding any with
"TODO" in the title), Experience Snapshot (most recent 2 entries from data/experience.json),
Core Expertise (from data/skills.json categories), Technology Stack (badges), Contact CTA
(email/LinkedIn/GitHub from data/resume.json). Add subtle fade-in and scroll-reveal animations
with Framer Motion — keep them tasteful, not distracting.
```

### Sprint 4 — About page
```
Read docs/04-about-page.md and content/about-story.md. Build app/about/page.tsx: photo
(public/images/photo-square.png, rounded-square crop), the story from content/about-story.md
rendered as prose, and a "Philosophy" section listing the three principles (SOLID, design
patterns applied deliberately, clean code) as short cards, not a bullet list. No fun-facts
section — leave it out entirely rather than rendering empty.
```

### Sprint 5 — Experience page
```
Build app/experience/page.tsx generating a card per entry in data/experience.json using the
existing schema (company, role, period, summary, technologies, achievements). Render as a
vertical timeline, most recent first. Technologies render as TechBadge components; achievements
as a clean bullet list. No image handling needed yet (images arrays are empty).
```

### Sprint 6 — Projects page
```
Read docs/07-project-page.md carefully before starting — it specifies how the Gallery component
must handle an empty images array (render nothing, no broken-image placeholder) and that the
confidentiality field is an internal note, never rendered to visitors.

Build app/projects/page.tsx (grid of ProjectCard linking to each case study) and
app/projects/[id]/page.tsx (full case study: overview, problem, solution, architecture diagram
embed, technologies, results, gallery, lessons learned) driven entirely by data/projects.json.
Skip rendering any field that's still literally "TODO" in the data rather than showing the
placeholder text to visitors.
```

### Sprint 7 — Architecture page
```
Build app/architecture/page.tsx. Install a Mermaid renderer (e.g. mermaid or
@mermaid-js/mermaid) and render each .mermaid file under docs/architecture/ as an embedded
diagram, styled to match the dark-slate palette (the diagrams already use the theme's accent
colors #22D3EE and #6366F1 in their style directives). Group by project and link each diagram
back to its case study on the Projects page.
```

### Sprint 12 — Contact
```
Read docs/12-contact-deployment.md. Build app/contact/page.tsx with direct links only — no form,
no backend: email (mailto:), LinkedIn, GitHub, and a resume download button linking to
public/documents/resume.pdf (stub this file for now if the auto-gen pipeline isn't built yet —
link to the existing uploaded .tex-compiled PDF as a placeholder).
```

### Sprint 13 — SEO
```
Add metadata (title, description, Open Graph tags, Twitter card) to every page using Next.js's
Metadata API. Generate a sitemap.xml and robots.txt. Add JSON-LD structured data (Person schema)
on the home page using data/resume.json. Add a favicon set.
```

---

## 4. Deployment to GitHub Pages — step by step

Because the repo is named `faridmaleki.github.io`, GitHub treats it as a **user site**: it
deploys from the repo root with no subpath/basePath configuration needed (unlike project sites
at `username.github.io/repo-name`).

### 4.1 — next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',      // static export — GitHub Pages has no Node server
  images: {
    unoptimized: true,   // next/image optimization needs a server; disable it
  },
};

module.exports = nextConfig;
```

### 4.2 — GitHub Actions workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 4.3 — Repo settings (one-time, manual)
1. Push the repo to `github.com/faridjb/faridmaleki.github.io` (must match this exact name for
   a user site)
2. Go to **Settings → Pages**
3. Under **Build and deployment → Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Push to `main` — the workflow above runs automatically and the site goes live at
   `https://faridmaleki.github.io`

### 4.4 — Later: custom domain
When you buy a domain:
1. Add a `public/CNAME` file containing just the domain (e.g. `faridmaleki.com`)
2. Add the corresponding DNS records at your registrar (A records to GitHub's IPs for an apex
   domain, or a CNAME record to `faridjb.github.io` for a subdomain)
3. Re-enable "Enforce HTTPS" in **Settings → Pages** once DNS propagates (usually automatic)

---

## 5. Post-deploy checklist
- [ ] `https://faridmaleki.github.io` loads and all nav links work
- [ ] Resume download link resolves to a real PDF (even if placeholder pending §3's v2 auto-gen)
- [ ] Lighthouse score check (target >90 for v1, >95 is a v2/Sprint-14 goal)
- [ ] Confirm no `TODO` strings are visible anywhere on the live site
- [ ] Double-check no employer-confidential screenshots or specifics slipped into Projects/
      Architecture beyond what's in the sanitized `data/projects.json`
- [ ] Share the link — this is the actual point