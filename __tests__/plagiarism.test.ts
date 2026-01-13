import { computeSimilarity } from '@/lib/plagiarism'

describe('computeSimilarity', () => {
  it('returns zeros for empty inputs', () => {
    const r = computeSimilarity('', '')
    expect(r.jaccard).toBe(0)
    expect(r.cosine).toBe(0)
  })

  it('returns 1 for identical text', () => {
    const r = computeSimilarity('Hello world', 'Hello world')
    expect(r.jaccard).toBe(1)
    expect(r.cosine).toBeCloseTo(1, 10)
  })

  it('is case and punctuation insensitive', () => {
    const r = computeSimilarity('Hello, world!', 'hello world')
    expect(r.jaccard).toBe(1)
    expect(r.cosine).toBeCloseTo(1, 10)
  })

  it('different texts yield low similarity', () => {
    const r = computeSimilarity('alpha beta gamma', 'delta epsilon zeta')
    expect(r.jaccard).toBe(0)
    expect(r.cosine).toBe(0)
  })

  it('partial overlap has intermediate scores', () => {
    const r = computeSimilarity('learn code build career', 'learn design build brand')
    expect(r.jaccard).toBeGreaterThan(0)
    expect(r.jaccard).toBeLessThan(1)
    expect(r.cosine).toBeGreaterThan(0)
    expect(r.cosine).toBeLessThan(1)
  })
})
