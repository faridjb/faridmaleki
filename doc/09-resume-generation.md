# 09 — Resume Page & Auto-Generated CV

## Requirement (confirmed)
Editing any `data/*.json` file (experience, skills, certificates, etc.) must automatically
update both the `/resume` web page **and** the downloadable PDF — no manual CV maintenance.

## Design: single source of truth
`data/resume.json` + `data/experience.json` + `data/skills.json` + `data/certificates.json` +
`data/publications.json` become the *only* place CV content lives. Your `.tex` CV becomes a
**generated artifact**, not a hand-maintained file.

## Pipeline
```
data/*.json  →  build script  →  .tex (filled template)  →  latexmk  →  public/documents/resume.pdf
                              →  React /resume page (same JSON, rendered directly)
```

1. **Template**: convert your existing `Farid-Maleki-2026-DataScience.tex` into a Jinja/Handlebars-
   style template with placeholders instead of hardcoded text (e.g. `{{experience}}` loop).
2. **Build script** (`scripts/generate-resume.ts` or `.py`): reads the JSON files, fills the
   template, writes a fresh `.tex` file.
3. **Compile**: run `latexmk -pdf` (via a GitHub Action, e.g. `xu-cheng/latex-action`) to produce
   `resume.pdf`.
4. **Wire into CI**: add a step to your existing GitHub Actions deploy workflow that runs before
   the Next.js build — triggered on any push touching `data/**`. Commit the generated PDF to
   `public/documents/resume.pdf` (or store as a build artifact copied in at deploy time — avoids
   committing binary diffs).
5. **Resume page**: renders directly from the same JSON (interactive timeline, skills matrix) —
   no separate content to keep in sync, and a "Download PDF" button links to the generated file.

## Why this over maintaining `.tex` by hand
You've been tailoring `.tex` CVs per application in our past sessions — that workflow stays
useful for *job-specific* tailored versions. This pipeline is specifically for the **canonical
CV on your site**, which should always mirror what's live on the page. Keep the tailoring
workflow for one-off applications; use this pipeline for the public-facing default.

## Open item
Once you're ready, share `Farid-Maleki-2026-DataScience.tex` structure (already uploaded) and
I'll convert it into the templated version with placeholders for Cursor to wire up.
