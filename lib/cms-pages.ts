import { prisma } from '@/lib/db'

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  return base || 'page'
}

export async function generateUniquePageSlug(input: string, excludeId?: string) {
  const baseSlug = slugify(input)
  let candidate = baseSlug
  let suffix = 1

  // keep trying until we find an unused slug
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.cmsPage.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    })

    if (!existing) {
      return candidate
    }

    suffix += 1
    candidate = `${baseSlug}-${suffix}`
  }
}

export function extractPageContent(versions?: Array<{ data: unknown }>) {
  if (!versions?.length) return ''
  const latest = versions[0]?.data as Record<string, unknown> | null | undefined
  const content = latest && typeof latest === 'object' ? (latest as any).content : null
  return typeof content === 'string' ? content : ''
}

export function summarizeContent(htmlContent: string) {
  if (!htmlContent) return ''
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.substring(0, 240)
}
