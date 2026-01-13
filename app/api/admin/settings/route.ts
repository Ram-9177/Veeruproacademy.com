import { NextResponse } from 'next/server'
import { RoleKey } from '@prisma/client'

import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { getSiteSettings, updateSiteSettings } from '@/lib/site-settings'

export async function GET() {
  const session = await auth()
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  if (!session?.user || !isAdmin(roles)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await getSiteSettings()
  return NextResponse.json({ settings })
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
    if (!session?.user || !isAdmin(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const general = body?.general ?? {}
    const payments = body?.payments ?? {}

    const updatePayload: Record<string, string> = {}

    if (typeof general.siteName === 'string') updatePayload.site_name = general.siteName
    if (typeof general.siteUrl === 'string') updatePayload.site_url = general.siteUrl
    if (typeof general.siteDescription === 'string') updatePayload.site_description = general.siteDescription
    if (typeof general.adminEmail === 'string') updatePayload.admin_email = general.adminEmail
    if (typeof general.supportEmail === 'string') updatePayload.support_email = general.supportEmail

    if (typeof payments.merchantName === 'string') updatePayload.merchant_name = payments.merchantName
    if (typeof payments.merchantUpi === 'string') updatePayload.merchant_upi = payments.merchantUpi
    if (typeof payments.paymentFormUrl === 'string') updatePayload.payment_form_url = payments.paymentFormUrl

    const updated = await updateSiteSettings(updatePayload)

    return NextResponse.json({ success: true, settings: updated })
  } catch (error) {
    console.error('Error saving settings', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
