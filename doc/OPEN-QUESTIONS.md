# Open Questions — status update

Resolved this round: architecture diagrams (done, see `docs/architecture/*.mermaid`),
confidentiality stance, About philosophy, resume auto-gen requirement, leadership philosophy,
GitHub username, domain, contact approach, branding theming approach.

## Still open — smaller, unblocks final content pass
- [ ] Your About-page story text (2–3 paragraphs) — send whenever ready
- [ ] `problem` field for each of the 5 case studies in `data/projects.json` (still TODO)
- [ ] `lessonsLearned` field for each case study (still TODO, 2 have partial notes)
- [ ] Pick your featured open-source repo from https://github.com/faridjb for the full-detail
      case study (`data/projects.json` → `open-source-github-project`) — this is the one project
      where real screenshots and exact metrics are fair game
- [ ] ADPlist testimonials — copy 2–4 real mentee comments into `data/testimonials.json`
- [ ] Confirm whether Robin / Procycons / Eastern Pharmaceutical are okay with the current
      "outcomes-only, no raw screenshots" treatment, or if you want to check with them directly
      before publishing even the sanitized version

## No longer blocking anything
Screenshots/gallery images: the data model (`gallery: []`) and page components should already be
built to render correctly with zero images and slot new ones in later — flagged as a Sprint 6
requirement, not something you need to provide now.
