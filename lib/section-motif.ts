export type SectionMotif = 'nodes' | 'stars' | 'hex' | 'waves';

const MOTIFS: SectionMotif[] = ['nodes', 'stars', 'hex', 'waves'];

/** Stable motif pick from a section key (eyebrow/heading). Safe for server + client. */
export function motifForSection(key: string): SectionMotif {
  if (!key) return 'nodes';
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % MOTIFS.length;
  }
  return MOTIFS[hash] ?? 'nodes';
}
