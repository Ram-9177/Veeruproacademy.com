

// Simple text similarity utilities for plagiarism checking
// Provides normalization, tokenization, Jaccard and Cosine similarity over term frequency.

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // remove punctuation
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim()
}

function tokenize(input: string): string[] {
  if (!input) return []
  return normalizeText(input).split(' ').filter(Boolean)
}

function jaccardSimilarity(aTokens: string[], bTokens: string[]): number {
  const aSet = new Set(aTokens)
  const bSet = new Set(bTokens)
  const intersection = new Set(Array.from(aSet).filter(x => bSet.has(x)))
  const union = new Set([...Array.from(aSet), ...Array.from(bSet)])
  return union.size === 0 ? 0 : intersection.size / union.size
}

function cosineSimilarity(aTokens: string[], bTokens: string[]): number {
  const freq = (tokens: string[]) => {
    const map = new Map<string, number>()
    tokens.forEach(t => map.set(t, (map.get(t) || 0) + 1))
    return map
  }
  const aFreq = freq(aTokens)
  const bFreq = freq(bTokens)
  const vocab = new Set([...Array.from(aFreq.keys()), ...Array.from(bFreq.keys())])
  let dot = 0, aMag = 0, bMag = 0
  vocab.forEach(term => {
    const aVal = aFreq.get(term) || 0
    const bVal = bFreq.get(term) || 0
    dot += aVal * bVal
    aMag += aVal * aVal
    bMag += bVal * bVal
  })
  if (aMag === 0 || bMag === 0) return 0
  return dot / (Math.sqrt(aMag) * Math.sqrt(bMag))
}

export function computeSimilarity(textA: string, textB: string) {
  const tokensA = tokenize(textA)
  const tokensB = tokenize(textB)
  return {
    jaccard: jaccardSimilarity(tokensA, tokensB),
    cosine: cosineSimilarity(tokensA, tokensB),
    tokensA,
    tokensB,
    lengthA: tokensA.length,
    lengthB: tokensB.length,
  }
}

export { normalizeText, tokenize, jaccardSimilarity, cosineSimilarity }
