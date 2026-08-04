# 07 — Project Case Study Page

## Data source
`data/projects.json` — each entry maps directly to a case-study page per the schema already in
that file (`overview`, `problem`, `solution`, `architectureDiagram`, `technologies`, `results`,
`gallery`, `lessonsLearned`, `confidentiality`).

## Gallery component — must handle the empty state gracefully
None of the 5 employer case studies have images yet (`gallery: []`), and won't for a while given
confidentiality review. The component must:
- Render nothing (not a broken image icon or empty box) when `gallery` is empty
- Accept images later with zero code changes — just push objects into the array:
  ```json
  { "gallery": [{ "src": "/images/projects/ai-call-center/dashboard-1.png", "caption": "..." }] }
  ```
- Support a mixed state (some projects with images, some without) since rollout will be gradual

## Confidentiality field
Each project has a `confidentiality` string. Render this nowhere on the public page — it's a
content-authoring note for you/Cursor, not visitor-facing copy. Use it to decide what numbers
and specifics are safe to show in `results`/`overview` at write time.

## Architecture diagram
Each project points to a `.mermaid` file under `docs/architecture/`. Render via a Mermaid or
React Flow component embedded in the case-study page — diagrams are already drafted for all 5
projects; the open-source project's diagram is still TODO pending repo selection.
