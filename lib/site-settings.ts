import { prisma } from '@/lib/db'
import { siteConfig } from '@/config/site'

export type SiteSettings = {
  site_name: string
  site_url: string
  site_description: string
  admin_email: string
  support_email: string
  merchant_name: string
  merchant_upi: string
  payment_form_url: string
}

const SETTINGS_KEY = 'site_settings'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: siteConfig.name,
  site_url: siteConfig.url,
  site_description: siteConfig.description,
  admin_email: 'admin@veerupro.academy',
  support_email: 'support@veerupro.academy',
  merchant_name: siteConfig.name,
  merchant_upi: '',
  payment_form_url: ''
}

function normalizeSettings(value: unknown): Partial<SiteSettings> {
  if (!value || typeof value !== 'object') return {}

  const record = value as Record<string, unknown>
  return {
    site_name: typeof record.site_name === 'string' ? record.site_name : undefined,
    site_url: typeof record.site_url === 'string' ? record.site_url : undefined,
    site_description: typeof record.site_description === 'string' ? record.site_description : undefined,
    admin_email: typeof record.admin_email === 'string' ? record.admin_email : undefined,
    support_email: typeof record.support_email === 'string' ? record.support_email : undefined,
    merchant_name: typeof record.merchant_name === 'string' ? record.merchant_name : undefined,
    merchant_upi: typeof record.merchant_upi === 'string' ? record.merchant_upi : undefined,
    payment_form_url: typeof record.payment_form_url === 'string' ? record.payment_form_url : undefined
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const stored = await prisma.setting.findUnique({
    where: { key: SETTINGS_KEY }
  })

  const normalized = normalizeSettings(stored?.value)
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...normalized
  }
}

export async function updateSiteSettings(update: Partial<SiteSettings>): Promise<SiteSettings> {
  const merged = {
    ...(await getSiteSettings()),
    ...update
  }

  await prisma.setting.upsert({
    where: { key: SETTINGS_KEY },
    create: {
      key: SETTINGS_KEY,
      value: merged
    },
    update: {
      value: merged
    }
  })

  return merged
}

export function toPublicSiteSettings(settings: SiteSettings) {
  return {
    site_name: settings.site_name,
    site_url: settings.site_url,
    site_description: settings.site_description,
    support_email: settings.support_email,
    merchant_name: settings.merchant_name,
    merchant_upi: settings.merchant_upi,
    payment_form_url: settings.payment_form_url
  }
}
