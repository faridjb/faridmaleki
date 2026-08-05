# PLAN.md — Farid Maleki Portfolio: Master Build & Deploy Plan

Single source of truth for building this in Cursor and shipping to
`https://faridjb.github.io/faridmaleki/`.

Every sprint below has a complete, copy-paste-ready Cursor prompt. Sprints 1-7, 12, 13, 15 are
v1 (ship these). Sprints 8-11 and 14 are v2 — the prompts are written and ready, they just run
after launch.

---

## 0. Status — what's decided, what's built, what's still open

**Decided:**

- Stack: Next.js 15 (App Router) + TypeScript + TailwindCSS + shadcn/ui, static export for
GitHub Pages
- Deploy (v1): GitHub Pages **project site** at `https://faridjb.github.io/faridmaleki/`
(repo `faridjb/faridmaleki`; requires `basePath` / `assetPrefix` — see §7)
- Contact: direct email/LinkedIn/GitHub links only, no form/backend for v1
- Branding: dark-slate palette, dark-mode default, Space Grotesk / Inter / JetBrains Mono,
CSS-variable tokens (themeable); logo = FM monogram (node-graph mark deferred)
- Confidentiality: employer projects (MCI, Rightel, Robin, Procycons, Eastern Pharma) →
outcomes/percentages only, no raw screenshots/infra specifics; one personal GitHub repo
gets full detail
- Content layout: a **flat** `doc/` folder (no top-level `data/` / `content/` / `docs/` split)
- Settings: config-driven — no hardcoded URLs, strings, or colors in components (see §2)
- Nav: pages that aren't built yet are hidden via an `enabled` flag, not dead links (see §2)
- No AI CV chatbot in this plan (revisit separately if ever wanted)

**Already built (in** `/doc`**):**

```
doc/
  00-project-vision.md        Vision, audience, sitemap
  01-branding.md              Palette, typography, logo direction
  04-about-page.md            About-page spec + philosophy (SOLID, design patterns, clean code)
  07-project-page.md          Case-study page spec + gallery empty-state requirement
  09-resume-generation.md     Auto-gen CV pipeline spec
  10-leadership.md            Leadership page spec + testimonials stub
  12-contact-deployment.md    Contact + domain decisions
  OPEN-QUESTIONS.md           Remaining content gaps
  about-story.md              Full About narrative (polished, ready to use)
  resume.json                 Name, title, tagline, location, email, links, summary, education
  experience.json             6 companies with role/period/location/summary/tech/achievements
  skills.json                 topSkills, 6 categories, languages, explicitGaps
  certificates.json           4 certificates
  publications.json           1 publication
  projects.json               6 case studies (5 employer + 1 open-source placeholder)
  open-source.json            GitHub username + API endpoint for Sprint 11
  ai-call-center.mermaid
  network-anomaly-detection.mermaid
  recruitment-matching-recommendation.mermaid
  esg-compliance-pipeline.mermaid
  evipackai-rag-platform.mermaid
```

**Data gaps Sprint 1 fixes (mechanical, no content decisions needed):**

- `doc/projects.json` → `architectureDiagram` values still point at
`docs/architecture/<name>.mermaid`; rewrite to `doc/<name>.mermaid`
- `doc/resume.json` → `"github": ""` is empty; fill with `https://github.com/faridjb`
(confirmed in `doc/12-contact-deployment.md`)
- `doc/testimonials.json` doesn't exist; create it as `[]` so the Leadership sprint has a
file to read

**Stale references inside** `doc/*.md`**:** several specs still mention `data/*.json`,
`docs/architecture/`, and `content/`. Those folders do not exist — the real paths are flat
under `doc/`. Every prompt below states this explicitly so Cursor doesn't follow the stale text.

**Still open (content, doesn't block any sprint):**

- Shorter "elevator" version of the About story (2-3 paragraphs) for the hero/summary block
- `problem` / `lessonsLearned` fields per case study in `doc/projects.json`
- Featured open-source repo pick (from `github.com/faridjb`) for the full-detail case study
- 2-4 real ADPlist testimonial quotes for `doc/testimonials.json`
- Confirm Robin / Procycons / Eastern Pharmaceutical are okay with outcomes-only treatment
before publishing even the sanitized case studies

Build with placeholders and swap content in later — the point of the JSON-driven structure is
that content updates never touch component code.

---



## 1. Repository structure (final)

```
faridmaleki/
  .github/workflows/deploy.yml
  app/
    layout.tsx
    page.tsx                  Home
    about/page.tsx
    experience/page.tsx
    projects/page.tsx
    projects/[id]/page.tsx
    architecture/page.tsx
    contact/page.tsx
    resume/page.tsx           (v2 — Sprint 9)
    leadership/page.tsx       (v2 — Sprint 10)
    open-source/page.tsx      (v2 — Sprint 11)
    blog/page.tsx             (v2 — Sprint 8)
    blog/[slug]/page.tsx      (v2 — Sprint 8)
    sitemap.ts  robots.ts
  components/
    ui/                       shadcn primitives
    Navbar.tsx  Footer.tsx  ProjectCard.tsx  Timeline.tsx
    Gallery.tsx (empty-state aware)  ArchitectureDiagram.tsx (mermaid renderer)
    TechBadge.tsx  SkillMatrix.tsx  ThemeToggle.tsx  MetricStat.tsx  Section.tsx
  config/
    site.config.ts            Single settings module — reads env, no inline literals
  lib/
    content.ts                Typed loaders for everything under doc/
    seo.ts                    Metadata + JSON-LD builders
  types/
    content.ts                Interfaces for the doc/*.json shapes
  content/
    blog/*.mdx                (v2 — Sprint 8)
  doc/                        Content + planning folder (JSON/MD/mermaid; specs are reference)
  scripts/
    generate-resume.ts        (v2 — Sprint 9)
    fetch-github-repos.ts     (v2 — Sprint 11)
  public/
    images/  documents/resume.pdf
  .env.example                Committed; .env.local is git-ignored
  next.config.js
  tailwind.config.ts
  package.json
```

---



## 2. Conventions — config-driven, no hardcoded values

This is a hard rule for every sprint: **no hardcoded URLs, emails, page titles, nav labels,
colors, or feature flags inside components.** Everything resolves through config or typed
content loaders.

### 2.1 — `config/site.config.ts`

The single settings module. Reads environment variables, falls back to sane defaults, and
exports one typed object:

```ts
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Farid Maleki',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://faridjb.github.io',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '/faridmaleki',
  defaultTheme: process.env.NEXT_PUBLIC_DEFAULT_THEME ?? 'dark',
  resumePdfPath: process.env.NEXT_PUBLIC_RESUME_PDF ?? '/documents/resume.pdf',
  nav: [
    { href: '/',             label: 'Home',        enabled: true  },
    { href: '/about',        label: 'About',       enabled: true  },
    { href: '/experience',   label: 'Experience',  enabled: true  },
    { href: '/projects',     label: 'Projects',    enabled: true  },
    { href: '/architecture', label: 'Architecture',enabled: true  },
    { href: '/contact',      label: 'Contact',     enabled: true  },
    { href: '/resume',       label: 'Resume',      enabled: false }, // Sprint 9
    { href: '/leadership',   label: 'Leadership',  enabled: false }, // Sprint 10
    { href: '/open-source',  label: 'Open Source', enabled: false }, // Sprint 11
    { href: '/blog',         label: 'Blog',        enabled: false }, // Sprint 8
  ],
} as const;
```

Navbar, Footer, and `sitemap.ts` all render from `siteConfig.nav.filter(i => i.enabled)`.
Shipping a v2 page = flipping one flag to `true`, never editing the Navbar.

### 2.2 — `.env.example` (committed) / `.env.local` (git-ignored)

```
NEXT_PUBLIC_SITE_NAME=Farid Maleki
NEXT_PUBLIC_SITE_URL=https://faridjb.github.io
NEXT_PUBLIC_BASE_PATH=/faridmaleki
NEXT_PUBLIC_DEFAULT_THEME=dark
NEXT_PUBLIC_RESUME_PDF=/documents/resume.pdf
```

`next.config.js` reads `NEXT_PUBLIC_BASE_PATH` for `basePath`/`assetPrefix` so the subpath is
defined in exactly one place (see §7.1).

### 2.3 — Typed content loaders (`lib/content.ts` + `types/content.ts`)

Pages never import raw JSON paths. `lib/content.ts` exports `getResume()`, `getExperience()`,
`getProjects()`, `getProject(id)`, `getSkills()`, `getCertificates()`, `getPublications()`,
`getTestimonials()`, `getAboutStory()`, `getDiagram(name)`. Interfaces live in
`types/content.ts` and mirror the actual JSON shapes in `doc/`.

Two shared helpers every page uses:

- `isTodo(value)` — true when a string is empty or contains `TODO`; callers skip rendering
that field entirely rather than printing placeholder text
- `stripInternal(project)` — drops `confidentiality` before data reaches any component, so
an internal note can't leak into rendered HTML by accident



### 2.4 — Colors and type

Palette lives as CSS variables in `globals.css`, mapped into `tailwind.config.ts` as theme
tokens (`bg-primary`, `bg-surface`, `accent`, `accent-alt`, `text-primary`, `text-muted`,
`success`). Components use token class names only — never `#22D3EE` or `bg-[#0B1120]`.

---



## 3. Modern design spec

So "modern" isn't left to interpretation. This is the visual contract every page sprint
follows — a systems-architect portfolio, not a creative showcase.

**Layout**

- Sticky top nav, translucent with backdrop blur, gains a bottom border once scrolled past 20px
- Content column max-width ~1024px (`max-w-5xl`), generous vertical rhythm (96-128px between
sections), consistent `Section` wrapper component with an eyebrow label + heading pattern
- Mobile: hamburger sheet nav, single-column stacking, no horizontal scroll at 320px

**Surface treatment**

- Hero backdrop: subtle dot-grid or faint radial gradient in accent hue at low opacity —
atmospheric, never competing with the text
- Cards: `bg-surface`, 1px hairline border, rounded-xl, hover raises 2-4px and shifts the
border to `accent` with a soft glow; transitions ~200ms ease-out

**Data-forward details (this is the senior-DS differentiator)**

- `MetricStat` component renders results like "70% latency reduction" or "6 weeks → 30 minutes"
as a large numeral in `success` with a muted caption underneath — measured outcomes are the
headline, not buried in bullet text
- Tech badges use JetBrains Mono at small size with `accent-alt` tinting
- Architecture diagrams render on `bg-surface` panels with a mono caption and a "view case
study" link

**Motion**

- Framer Motion fade-up on section enter (~24px travel, 400ms, staggered children ~60ms),
triggered once per element
- Every animation wrapped so `prefers-reduced-motion: reduce` disables travel and keeps opacity

**Accessibility floor (non-negotiable)**

- WCAG AA contrast on both themes, visible focus rings using the accent token
- Semantic landmarks (`header`/`main`/`nav`/`footer`), one `h1` per page, real alt text
- Full keyboard operability for nav, theme toggle, and gallery

---



## 4. Roadmap: v1 (ship this first) vs v2 (after launch)

**v1 — get a live, credible site in front of recruiters:**
Sprint 1 (repo setup) → 2 (design system) → 3 (home) → 4 (about) → 5 (experience) →
6 (projects) → 7 (architecture) → 12 (contact) → 13 (SEO) → 15 (deploy)

**v2 — depth and polish, after v1 is live:**
Sprint 8 (blog), 9 (resume page + auto-gen PDF pipeline), 10 (leadership),
11 (open source auto-fetch), 14 (performance tuning)

Every v2 page stays hidden from the nav (`enabled: false` in `site.config.ts`) until its
sprint ships, so v1 never exposes a dead link.

Reasoning: a live site with Home/About/Experience/Projects/Architecture/Contact does the actual
job — getting a CTO or recruiter to a credible page fast — sooner than a fully-featured
15-sprint build would.

### Sprint index — where each prompt lives

Prompts are grouped by release, not by number, so §5 runs 1-7 then jumps to 12. Sprints 8-11
and 14 are not missing — they're in §6.

| Sprint | Topic                          | Release | Section |
| ------ | ------------------------------ | ------- | ------- |
| 1      | Repository setup               | v1      | §5      |
| 2      | Design system                  | v1      | §5      |
| 3      | Home page                      | v1      | §5      |
| 4      | About page                     | v1      | §5      |
| 5      | Experience page                | v1      | §5      |
| 6      | Projects page and case studies | v1      | §5      |
| 7      | Architecture page              | v1      | §5      |
| 8      | Blog                           | v2      | §6      |
| 9      | Resume page + auto-gen PDF     | v2      | §6      |
| 10     | Leadership                     | v2      | §6      |
| 11     | Open source                    | v2      | §6      |
| 12     | Contact                        | v1      | §5      |
| 13     | SEO                            | v1      | §5      |
| 14     | Performance and polish         | v2      | §6      |
| 15     | Deploy                         | v1      | §5      |

---



## 5. Cursor prompts — v1

Run in order. Each prompt is self-contained and can be pasted as-is.

### Sprint 1 — Repository setup

```
Initialize a Next.js 15 project with the App Router, TypeScript, TailwindCSS, and ESLint in
this repository root (faridjb/faridmaleki). Add Prettier with a standard config, shadcn/ui,
and Framer Motion.

IMPORTANT PATH RULE for this repo: all content lives FLAT in doc/ — doc/*.json, doc/*.md,
doc/*.mermaid. There is no data/, docs/, or content/ folder for source content. Some spec
files inside doc/ still mention data/ or docs/architecture/ — those references are stale,
ignore them and use doc/.

CONFIG RULE for this repo: no hardcoded URLs, emails, labels, colors, or feature flags in
components. Everything reads from config/site.config.ts or the typed content loaders.

Do all of the following:

1. Configure static export for a GitHub Pages PROJECT site at
   https://faridjb.github.io/faridmaleki/ — next.config.js must read the base path from the
   environment rather than inlining it:
     const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/faridmaleki';
     module.exports = { output: 'export', basePath, assetPrefix: basePath,
       trailingSlash: true, images: { unoptimized: true } };

2. Create config/site.config.ts exporting a typed `siteConfig` object with: name, url,
   basePath, defaultTheme, resumePdfPath, and a `nav` array of { href, label, enabled }.
   Enabled: /, /about, /experience, /projects, /architecture, /contact.
   Disabled (not built yet): /resume, /leadership, /open-source, /blog.
   Every value reads process.env.NEXT_PUBLIC_* with a sensible fallback.

3. Create .env.example with NEXT_PUBLIC_SITE_NAME, NEXT_PUBLIC_SITE_URL,
   NEXT_PUBLIC_BASE_PATH, NEXT_PUBLIC_DEFAULT_THEME, NEXT_PUBLIC_RESUME_PDF.
   Ensure .env.local is git-ignored.

4. Create types/content.ts with interfaces matching the ACTUAL shapes of the files in doc/:
   Resume (name, title, tagline, location, email, linkedin, github, summary, education[]),
   ExperienceEntry (company, role, period, location, summary, technologies[], achievements[],
   images[]), Project (id, title, company, confidentiality, heroImage, overview, problem,
   solution, architectureDiagram, technologies[], results[], gallery[], lessonsLearned),
   Skills (topSkills[], categories[{name, skills[]}], languages[{name, level}],
   explicitGaps[]), Certificate, Publication, Testimonial.

5. Create lib/content.ts with typed loader functions reading from doc/: getResume,
   getExperience, getProjects, getProject(id), getSkills, getCertificates, getPublications,
   getTestimonials, getAboutStory, getDiagram(name). Also export two helpers:
   - isTodo(value: string | undefined): boolean — true if empty or contains "TODO"
   - stripInternal(project): removes the `confidentiality` field before returning data to
     components, so it can never render
   getTestimonials must return [] gracefully if doc/testimonials.json is missing.

6. Fix three data gaps in doc/:
   - doc/projects.json: rewrite every architectureDiagram value from
     "docs/architecture/<name>.mermaid" to "doc/<name>.mermaid"
   - doc/resume.json: set "github" to "https://github.com/faridjb" (it's currently empty)
   - create doc/testimonials.json containing an empty array []

Do not create any pages or UI yet — skeleton, config, types, loaders, and the data fixes only.
Verify `npm run build` succeeds.
```



### Sprint 2 — Design system

```
Read doc/01-branding.md and §3 (Modern design spec) of plan.md before starting.

Build the design system. No page-specific code in this sprint.

1. Palette as CSS variables in app/globals.css — define both dark and light sets, dark is the
   default (driven by siteConfig.defaultTheme). Tokens: bg-primary #0B1120, bg-surface #111827,
   accent #22D3EE, accent-alt #6366F1, text-primary #E5E7EB, text-muted #9CA3AF,
   success #34D399. Derive the light set by inverting lightness and keeping accent hues.
   Map all of them into tailwind.config.ts as theme colors. Components must use token class
   names only — never raw hex values anywhere outside globals.css.

2. Fonts via next/font: Space Grotesk (headings), Inter (body), JetBrains Mono (code, tech
   badges, captions). Wire as CSS variables and set Tailwind fontFamily accordingly.

3. Logo: an "FM" monogram in a rounded-square badge as an inline SVG component that inherits
   currentColor, so it works in both themes.

4. Components (shadcn/ui primitives where sensible):
   - Navbar: sticky, translucent with backdrop-blur, gains a bottom hairline border after
     20px of scroll. Renders links from siteConfig.nav.filter(item => item.enabled) — never
     hardcode the link list. Mobile: hamburger opening a sheet. Active route highlighted.
   - Footer: monogram, email/LinkedIn/GitHub from doc/resume.json via getResume(), copyright,
     same enabled-filtered nav links.
   - ThemeToggle: light/dark via CSS variables, persists choice, no flash of wrong theme on
     load.
   - Section: wrapper taking an eyebrow label, heading, optional description; handles
     max-w-5xl width and vertical rhythm.
   - Card: bg-surface, hairline border, rounded-xl, hover lift 2-4px with accent border and
     soft glow, ~200ms ease-out.
   - TechBadge: small JetBrains Mono pill tinted with accent-alt.
   - MetricStat: large numeral in the success token with a muted caption below — used for
     results like "70% latency reduction" and "6 weeks → 30 minutes".
   - Timeline + TimelineItem: vertical rail with dot markers, most-recent-first ordering.
   - Reveal: Framer Motion wrapper doing fade-up (24px, 400ms, stagger children 60ms), fires
     once, and fully disables travel under prefers-reduced-motion: reduce.

5. Accessibility: WCAG AA contrast in both themes, visible accent focus rings, semantic
   landmarks, keyboard-operable nav and toggle.
```



### Sprint 3 — Home page

```
Read doc/00-project-vision.md for the value proposition and audience. All data comes from
doc/ via the lib/content.ts loaders — no hardcoded copy, no raw JSON imports.

Build app/page.tsx with these sections in order, each wrapped in Section + Reveal:

1. Hero — name, title, and tagline from getResume() ("Farid J. Maleki", "Senior Data Scientist
   / AI Engineer", "Driving AI Transformation — Conversational AI, Agentic Orchestration,
   LLMOps"), the location line, and two CTAs: "View Projects" (/projects) and "Download
   Resume" (siteConfig.resumePdfPath). Subtle dot-grid or faint radial accent gradient
   backdrop at low opacity.

2. Impact strip — 3-4 MetricStat components pulled from the strongest `results` entries across
   getProjects(): 70% latency reduction, 6 weeks → 30 minutes, 95%+ retrieval accuracy,
   MTTR under 1 hour. Skip any project whose title contains TODO (use isTodo()).

3. Featured Projects — top 3 from getProjects(), excluding entries where isTodo(title). Render
   as ProjectCard grid linking to /projects/[id]. Show title, company, overview, and up to 4
   TechBadges.

4. Experience Snapshot — the 2 most recent entries from getExperience() (MCI R&D Center, Robin)
   as compact cards: company, role, period, summary, top 2 achievements. Link to /experience.

5. Core Expertise — categories from getSkills(): render each category name with its skills as
   TechBadges. Show topSkills prominently. Do not render the explicitGaps array anywhere —
   that's an internal field.

6. Contact CTA — email, LinkedIn, GitHub from getResume(), with a short line inviting contact.

Use next/link for all internal navigation so basePath is applied automatically. Keep motion
tasteful, and honor prefers-reduced-motion.
```



### Sprint 4 — About page

```
Read doc/04-about-page.md (ignore its stale content/ path reference) and doc/about-story.md.

Build app/about/page.tsx:

1. Header — heading plus the summary line from getResume().

2. Photo — public/images/photo-square.png, rounded-square crop, roughly 400x400 display,
   sitting alongside the intro on desktop and stacking above it on mobile. If the file is
   missing, render the layout without a broken image box.

3. Story — the full narrative from doc/about-story.md via getAboutStory(), rendered as
   readable prose: comfortable measure, generous paragraph spacing, muted-but-legible body
   color. Parse the markdown rather than dumping raw text.

4. Philosophy — a 3-card grid (not a bullet list) for the confirmed principles:
   - "SOLID principles" — code structured for change, not just for working today
   - "Design patterns, applied deliberately" — the right structural solution for a recurring
     problem, not patterns for their own sake
   - "Clean code" — readability and maintainability as a first-class concern
   Each card gets a short one-line elaboration and a mono eyebrow label.

5. Education — from getResume().education, rendered as a compact list (institution, degree,
   period). Skip entries whose period is empty rather than showing a dangling dash.

Do NOT add a fun-facts section — it's intentionally omitted, so leave it out entirely rather
than rendering an empty block.
```



### Sprint 5 — Experience page

```
Build app/experience/page.tsx from getExperience() — 6 entries, most recent first, no
hardcoded company data.

Each entry renders as a TimelineItem card containing:
- company and role as the heading pair
- period and location as mono muted metadata
- summary as a short lead paragraph
- technologies as TechBadge components
- achievements as a clean bullet list; any achievement containing a percentage or a
  "X → Y" style outcome should have that figure visually emphasized with the success token

Use the Timeline component from Sprint 2 (vertical rail, dot markers). The `images` arrays are
all empty — do not render any image slot or placeholder for them, but keep the component ready
to render a small thumbnail row if images appear later.

Add a short page intro noting 6+ years across telecom, recruitment, ESG/compliance, pharma,
and research — derive the framing from getResume().summary rather than writing new claims.
```



### Sprint 6 — Projects page and case studies

```
Read doc/07-project-page.md carefully first. Ignore its stale path references (data/,
docs/architecture/) — use doc/projects.json through getProjects() and doc/*.mermaid.

Two rules that matter more than anything else in this sprint:
- The `confidentiality` field is an INTERNAL authoring note. It must never render to visitors.
  Load projects through stripInternal() so it's removed before reaching any component.
- Any field whose value is empty or contains "TODO" must be skipped entirely (use isTodo()).
  Never print placeholder text, never render an empty section heading with nothing under it.

Build two routes:

1. app/projects/page.tsx — a responsive grid of ProjectCard, one per entry from getProjects(),
   excluding entries where isTodo(title) (the open-source placeholder is not ready yet). Each
   card: title, company, overview, up to 4 TechBadges, and the single strongest result as a
   MetricStat. Links to /projects/[id].

2. app/projects/[id]/page.tsx — full case study using generateStaticParams() over the project
   ids so it works with static export. Section order: Overview, Problem, Solution,
   Architecture (embed the diagram via ArchitectureDiagram reading the .mermaid path from the
   project's architectureDiagram field, which points at doc/<name>.mermaid), Technologies,
   Results (MetricStat row), Gallery, Lessons Learned.

3. Gallery component requirements — the gallery arrays are all currently empty and will stay
   that way for a while:
   - Renders NOTHING when the array is empty: no broken image icon, no empty box, no heading
   - Accepts { src, caption } objects later with zero code changes
   - Handles a mixed state (some projects with images, some without) since rollout is gradual
   - When images exist: responsive grid, lazy loading, captions in mono, keyboard-accessible
     lightbox

Add a "Back to all projects" link and prev/next case-study navigation at the bottom.
```



### Sprint 7 — Architecture page

```
Build app/architecture/page.tsx plus the ArchitectureDiagram component.

Install a Mermaid renderer (the `mermaid` package) and render each of the five diagram files
that live FLAT in doc/ (not doc/architecture/, which does not exist):
  doc/ai-call-center.mermaid
  doc/network-anomaly-detection.mermaid
  doc/recruitment-matching-recommendation.mermaid
  doc/esg-compliance-pipeline.mermaid
  doc/evipackai-rag-platform.mermaid

Requirements:
- ArchitectureDiagram takes a diagram path, loads the file contents through getDiagram(), and
  renders it client-side. Keep the page itself a server component and isolate mermaid in a
  client component so static export still works.
- Theme the mermaid config from the CSS palette tokens. The diagrams already carry style
  directives using the theme accents (#22D3EE, #6366F1) — the surrounding chrome must match:
  bg-surface panel, hairline border, rounded corners, readable at mobile width (allow
  horizontal scroll on small screens rather than shrinking text into illegibility).
- Group diagrams by project, using the title and company from getProjects() as the heading
  for each, and give each one a "View full case study" link to /projects/[id].
- Re-render diagrams on theme change so a light/dark switch doesn't leave stale colors.
- If a .mermaid file fails to parse, render a small muted "diagram unavailable" note instead
  of crashing the page.
```



> Sprints 8-11 come next numerically but are v2 — their prompts are in §6. v1 continues here
> with Sprint 12.

### Sprint 12 — Contact

```
Read doc/12-contact-deployment.md. Build app/contact/page.tsx with direct links only — no
form, no backend, no third-party email service.

All values come from getResume() — do not type any address or URL into the component:
- Email (mailto:) — farid.j.eng@gmail.com
- LinkedIn — https://www.linkedin.com/in/farid-j-maleki
- GitHub — https://github.com/faridjb
- Location line, so recruiters immediately see Netherlands / EU-relocation / remote openness

Layout: a short direct heading and one-line invitation, then a 3-card contact grid (each card
an icon, label, and the value itself as the link text), then a prominent "Download Resume"
button pointing at siteConfig.resumePdfPath.

If public/documents/resume.pdf doesn't exist yet, stub it with the existing .tex-compiled PDF
so the link never 404s — Sprint 9 replaces it with the generated file.

External links get target="_blank" and rel="noopener noreferrer". Email and profile links must
be keyboard-focusable with visible focus rings.
```



### Sprint 13 — SEO

```
Add SEO across the whole site. All URLs must be built from siteConfig (url + basePath) —
never hardcode https://faridjb.github.io/faridmaleki anywhere.

1. Create lib/seo.ts exporting buildMetadata({ title, description, path, image }) and
   absoluteUrl(path) helpers that compose siteConfig.url + siteConfig.basePath + path.

2. app/layout.tsx: metadataBase from absoluteUrl('/'), a title template like
   "%s | Farid Maleki", default description from getResume().summary, and default Open Graph
   and Twitter card entries.

3. Per-page metadata via the Metadata API on every route. Case-study pages use
   generateMetadata() with the project title, company, and overview from getProjects().
   Descriptions should lead with the measured outcome where one exists.

4. app/sitemap.ts — generate entries from siteConfig.nav.filter(i => i.enabled) plus every
   project id from getProjects(), with absolute URLs including the base path. Disabled nav
   entries must not appear.

5. app/robots.ts — allow all, and point at the absolute sitemap URL.

6. JSON-LD Person schema on the home page built from getResume(): name, jobTitle, email,
   sameAs (LinkedIn, GitHub), alumniOf from the education array, address from location,
   knowsAbout from getSkills().topSkills. Inject as a script tag with
   type="application/ld+json".

7. Favicon set (ico, apple-touch-icon, 192/512 PNGs) generated from the FM monogram, plus a
   web manifest, plus an Open Graph image at 1200x630 using the monogram, name, and title on
   the dark-slate background.

Verify after building that the exported HTML contains absolute URLs with the /faridmaleki
prefix and that no page is missing a title or description.
```



### Sprint 15 — Deploy

```
Ship the site to GitHub Pages as a project site at https://faridjb.github.io/faridmaleki/.

1. Create .github/workflows/deploy.yml exactly as specified in §7.2 of plan.md: triggers on
   push to main and workflow_dispatch, permissions for pages + id-token, a pages concurrency
   group, a build job (checkout, setup-node 20 with npm cache, npm ci, npm run build,
   upload-pages-artifact from ./out) and a deploy job using actions/deploy-pages@v4.

2. The build step must export the NEXT_PUBLIC_* environment variables from §2.2 so basePath,
   site URL, and theme resolve identically in CI and locally.

3. Add public/.nojekyll so GitHub Pages doesn't strip any _next/ directories.

4. Confirm npm run build produces ./out with an index.html and a _next directory whose asset
   URLs are prefixed with /faridmaleki.

Then walk me through the one-time repo settings: Settings → Pages → Build and deployment →
Source = GitHub Actions (not "Deploy from a branch"), then push to main and confirm the run
succeeds and the site loads.
```

---



## 6. Cursor prompts — v2

These run after v1 is live. Each one ends by flipping its nav entry to `enabled: true` in
`config/site.config.ts`, which is the only change needed to surface the page.

### Sprint 8 — Blog

```
Add an MDX blog. Posts live in content/blog/*.mdx (this is authored content, separate from
the doc/ reference material).

1. Install and configure MDX for the App Router (@next/mdx or next-mdx-remote — pick whichever
   works cleanly with output: 'export'). Frontmatter fields: title, description, date, tags[],
   draft (boolean).

2. app/blog/page.tsx — post list, newest first, excluding draft: true. Each item: title, date,
   reading time, description, tag badges. Add client-side tag filtering with the active tag
   reflected in the URL query so filtered views are shareable.

3. app/blog/[slug]/page.tsx — post detail with generateStaticParams over the MDX files.
   Include a reading-time estimate, an auto-generated table of contents from h2/h3 for longer
   posts, prev/next post links, and syntax-highlighted code blocks (rehype-pretty-code or
   shiki) themed to the site palette using JetBrains Mono.

4. Styling matches the About page prose treatment — same measure, spacing, and type scale.
   Blockquotes and inline code use accent-alt tinting.

5. Add per-post metadata via generateMetadata() using lib/seo.ts, include posts in
   app/sitemap.ts, and add an RSS feed at /feed.xml generated at build time.

6. Seed one real post so the page isn't empty on launch — draft it from the AI call center
   case study in doc/projects.json (architecture decisions behind the on-prem voice agent),
   respecting the confidentiality note on that entry: outcomes and percentages only, no
   internal system names or infra specifics.

7. Set the /blog nav entry to enabled: true in config/site.config.ts.
```



### Sprint 9 — Resume page and auto-generated PDF

```
Read doc/09-resume-generation.md (ignore its stale data/ path references — the JSON lives in
doc/). The requirement: editing any doc/*.json must update BOTH the /resume web page and the
downloadable PDF, with no manual CV maintenance.

1. app/resume/page.tsx — render directly from getResume(), getExperience(), getSkills(),
   getCertificates(), getPublications(). Sections: header (name, title, location, contact
   links), summary, experience timeline with achievements, skills matrix grouped by the
   categories in doc/skills.json, education, certificates, publications, languages. Do not
   render the explicitGaps array — internal only. Add a prominent "Download PDF" button
   pointing at siteConfig.resumePdfPath, and a print stylesheet so browser-print produces a
   clean document.

2. Build a SkillMatrix component: category rows with skill badges, visually scannable in under
   10 seconds, no invented proficiency percentages (the data has no proficiency levels and
   inventing them would be dishonest).

3. scripts/generate-resume.ts — reads the doc/*.json files, fills a LaTeX template at
   templates/resume.tex.hbs (converted from the existing Farid-Maleki-2026-DataScience.tex by
   replacing hardcoded content with loops and placeholders), and writes a fresh .tex file to a
   build directory. Template path and output path come from config/env, not string literals.

4. Wire into CI: add a job to .github/workflows/deploy.yml that runs the generator and then
   compiles with xu-cheng/latex-action (latexmk -pdf) BEFORE the Next.js build, copying the
   result to public/documents/resume.pdf. Produce it as a build artifact rather than
   committing the binary. The step should run on any push touching doc/**.

5. Verify the pipeline: change a value in doc/experience.json, run the build, and confirm both
   the /resume page and the PDF reflect it.

6. Set the /resume nav entry to enabled: true in config/site.config.ts.
```



### Sprint 10 — Leadership

```
Read doc/10-leadership.md. Build app/leadership/page.tsx.

1. The "tree" milestone model — explain the philosophy in Farid's own framing: a project is a
   tree; first build the trunk (the core working system), then add branches, leaves, and
   flowers (features) over time, with each milestone targeting a specific, tangible, valuable
   output rather than a vague phase. Pair it with a simple trunk → branches → leaves diagram
   (inline SVG or a mermaid diagram styled like the architecture ones), illustrated with how
   EviPackAI's RAG platform was delivered incrementally.

2. Team composition philosophy — task assignment based on each engineer's background,
   communication style, and fit; engineers are people first, and a team works best built
   around actual strengths rather than forcing a role onto someone.

3. Concrete result callout — 3-person team at Eastern Pharmaceutical Group, 6 weeks → 30
   minutes turnaround, rendered with MetricStat and linked to the EviPackAI case study.

4. Mentoring — ADPlist mentoring across many countries, framed from doc/about-story.md. Render
   testimonials from getTestimonials() reading doc/testimonials.json. CRITICAL: if the array
   is empty, render NO testimonial section at all — no heading, no empty state, no placeholder
   quote. The section appears only once real quotes are added.

5. Set the /leadership nav entry to enabled: true in config/site.config.ts.
```



### Sprint 11 — Open source

```
Build app/open-source/page.tsx listing GitHub repositories.

Read doc/open-source.json for the username (faridjb) and API endpoint — never hardcode either
in the component.

1. scripts/fetch-github-repos.ts — fetches repos at build time from the endpoint in
   doc/open-source.json, keeps name, description, language, stars, forks, topics, homepage,
   html_url, and updated_at, filters out forks and archived repos, sorts by last updated, and
   writes the result to a cached JSON file. Static export means no client-side fetch on page
   load: the data must be baked in at build time. Handle rate limiting and API failure by
   falling back to the previously cached file so a GitHub outage never breaks the build.

2. app/open-source/page.tsx — renders the cached list as a card grid: repo name, description,
   language dot, star and fork counts, topic badges, last-updated date, and a link out. Add
   language filtering.

3. Feature the chosen showcase repo at the top, linked to its full case study
   (/projects/open-source-github-project). This is the one project where real screenshots,
   code snippets, and exact metrics are fair game — the confidentiality field in
   doc/projects.json confirms it. Skip this feature block while that entry still contains
   TODO values (use isTodo()).

4. Add a repo-refresh step to the CI workflow so the list stays current on each deploy.

5. Set the /open-source nav entry to enabled: true in config/site.config.ts.
```



### Sprint 14 — Performance and polish

```
Tune the site to Lighthouse >95 across Performance, Accessibility, Best Practices, and SEO on
both mobile and desktop. Measure first with an actual Lighthouse run against the production
build, then fix what the report shows — do not optimize blind.

Focus areas:
1. Fonts — subset to the characters actually used, preload only the weights in use,
   font-display: swap, and confirm no layout shift from font swapping.
2. Images — correct dimensions on every image to eliminate CLS, modern formats, lazy loading
   below the fold. Since images.unoptimized is required for static export, pre-optimize source
   files in public/images/ rather than relying on next/image.
3. JavaScript — dynamic-import the mermaid renderer so it only loads on the architecture and
   case-study pages; audit the bundle for anything shipping to routes that don't need it;
   verify Framer Motion isn't pulled into pages with no animation.
4. Motion budget — no animation over 400ms, nothing animating above the fold on first paint,
   and prefers-reduced-motion verified working on every animated component.
5. Accessibility pass — keyboard-navigate every page end to end, check focus order and focus
   ring visibility, verify AA contrast in BOTH themes, confirm screen-reader landmarks and
   heading order.
6. Add a 404 page (app/not-found.tsx) matching the site design with links back to the main
   sections.

Report the before/after Lighthouse numbers so the improvement is visible.
```

---



## 7. Deployment to GitHub Pages — step by step

This repo is `faridjb/faridmaleki` — a **project site**, not a user site. It publishes at
`https://faridjb.github.io/faridmaleki/` and **requires** `basePath` / `assetPrefix`.

### 7.1 — next.config.js

The subpath is defined once, in the environment, and read here:

```js
/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/faridmaleki';

const nextConfig = {
  output: 'export',      // static export — GitHub Pages has no Node server
  basePath,              // project site lives under /faridmaleki
  assetPrefix: basePath,
  trailingSlash: true,   // plays nicer with GitHub Pages routing
  images: {
    unoptimized: true,   // next/image optimization needs a server; disable it
  },
};

module.exports = nextConfig;
```



### 7.2 — GitHub Actions workflow

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
    env:
      NEXT_PUBLIC_SITE_NAME: Farid Maleki
      NEXT_PUBLIC_SITE_URL: https://faridjb.github.io
      NEXT_PUBLIC_BASE_PATH: /faridmaleki
      NEXT_PUBLIC_DEFAULT_THEME: dark
      NEXT_PUBLIC_RESUME_PDF: /documents/resume.pdf
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

Sprint 9 adds a resume-generation step to the `build` job, before `npm run build`.

### 7.3 — Repo settings (one-time, manual)

1. Use the existing repo `github.com/faridjb/faridmaleki` (do **not** rename to
  `*.github.io` for v1)
2. Go to **Settings → Pages**
3. Under **Build and deployment → Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Push to `main` — the workflow runs automatically and the site goes live at
  `https://faridjb.github.io/faridmaleki/`



### 7.4 — Later: custom domain

When you buy a domain:

1. Add a `public/CNAME` file containing just the domain (e.g. `faridmaleki.com`)
2. Add the corresponding DNS records at your registrar (A records to GitHub's IPs for an apex
  domain, or a CNAME record to `faridjb.github.io` for a subdomain)
3. Set `NEXT_PUBLIC_BASE_PATH=` (empty) and `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` in
  the workflow env block — because the base path is config-driven, this is the only change
   needed; no component or config file edits
4. Re-enable "Enforce HTTPS" in **Settings → Pages** once DNS propagates (usually automatic)

---



## 8. Post-deploy checklist

**Routing and assets**

- [ ] `https://faridjb.github.io/faridmaleki/` loads; CSS, fonts, and images all resolve
  ```
  (no 404s from a missing `/faridmaleki` prefix)
  ```
- [ ] Every nav link works, and deep links like `/faridmaleki/projects/ai-call-center/` load
  ```
  directly on refresh
  ```
- [ ] Nav shows only the six enabled v1 pages — no dead links to `/blog`, `/resume`,
  ```
  `/leadership`, or `/open-source`
  ```
- [ ] `sitemap.xml` and `robots.txt` contain absolute URLs with the base path, and list no
  ```
  disabled routes
  ```

**Content integrity**

- [ ] No `TODO` string is visible anywhere on the live site (check case studies especially)
- [ ] No `confidentiality` text renders on any project page — view source to confirm
- [ ] No employer-confidential screenshots or infra specifics beyond what's in the sanitized
  ```
  `doc/projects.json`
  ```
- [ ] `explicitGaps` from `doc/skills.json` appears nowhere in the rendered output
- [ ] Resume download link resolves to a real PDF (placeholder is fine until Sprint 9)

**Code conventions**

- [ ] No hardcoded emails, profile URLs, or site URLs in components — all trace back to
  ```
  `config/site.config.ts` or `doc/resume.json`
  ```
- [ ] No raw hex colors outside `globals.css` / `tailwind.config.ts`
- [ ] `.env.local` is git-ignored and `.env.example` is committed

**Quality**

- [ ] Lighthouse check (target >90 for v1; >95 is the Sprint 14 goal)
- [ ] Renders correctly at 320px, 768px, and 1440px
- [ ] Light and dark themes both pass AA contrast, and the toggle persists without a flash
- [ ] Keyboard-only navigation works across every page
- [ ] Open Graph preview renders correctly (test the URL in the LinkedIn post inspector)

**Then**

- [ ] Share the link — this is the actual point