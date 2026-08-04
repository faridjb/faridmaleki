# 12 — Contact & Deployment (confirmed decisions)

## Contact (Sprint 12)
No contact form for v1 — direct links only:
- Email: `farid.j.eng@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/farid-j-maleki`
- GitHub: `https://github.com/faridjb`
- Resume download (generated PDF, see `09-resume-generation.md`)

This removes the need for a backend/email service (Formspree, serverless function) in v1 —
simpler build, one less moving part, one less thing that can silently break. Revisit a form only
if you find direct links aren't converting.

## Domain (Sprint 15)
- **v1**: `faridmaleki.github.io` (default GitHub Pages domain) — no custom-domain config needed
  yet, simplifies the deploy pipeline (no DNS, no HTTPS cert setup beyond GitHub's default)
- **Later**: once you buy a custom domain, deployment doc gets a short addendum — GitHub Pages
  custom domain setup is a `CNAME` file + DNS record, ~10 minutes of work, not a re-architecture

## Branding theming (Sprint 2)
Palette in `01-branding.md` should ship as CSS variables / Tailwind theme tokens (not hardcoded
hex values in components) specifically so you can swap the whole palette later by editing one
file, without touching component code. This was already the right default — flagging it here so
it's explicit in the spec for Cursor: **no hardcoded colors in components, tokens only.**
