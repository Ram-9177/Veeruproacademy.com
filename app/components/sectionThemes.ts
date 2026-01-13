// Central registry for section variants
// Each key maps to utility classes for background, effects, and elevation.

export const sectionThemes: Record<string, string> = {
  default: 'bg-background/80 backdrop-blur-xl border border-border/40 shadow-md',
  accent: 'bg-primary text-primary-foreground shadow-2xl',
  glass: 'bg-background/65 backdrop-blur-2xl border border-border/30 shadow-lg',
  minimal: 'bg-transparent',
  subtle: 'bg-background/75 backdrop-blur-lg border border-border/30 shadow-md',
  colored: 'bg-background/70 backdrop-blur-lg border border-border/30 shadow-md',
  'pattern-1': 'bg-variation-1 shadow-lg',
  'pattern-2': 'bg-variation-2 shadow-lg',
  'pattern-3': 'bg-variation-3 shadow-lg',
  'pattern-4': 'bg-variation-4 shadow-lg',
  'pattern-5': 'bg-variation-5 shadow-lg',
  mesh: 'mesh-pattern shadow-xl',
  circuit: 'circuit-pattern shadow-xl',
  wave: 'wave-pattern shadow-lg',
  organic: 'organic-pattern shadow-xl',
  crystalline: 'crystalline-pattern shadow-xl'
}
