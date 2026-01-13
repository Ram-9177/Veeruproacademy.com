import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { requireAdmin } from '@/lib/auth-server'
import { getServerSession } from '@/lib/auth-server'
import { Card } from '@/src/components/ui/card'
import { AdminStateMessage } from '../components/AdminStateMessage'
import { PaymentRequestsTable } from './PaymentRequestsTable'
import type { PaymentRequestDto } from '@/app/api/admin/payment-requests/route'

async function fetchPaymentRequests(): Promise<PaymentRequestDto[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/admin/payment-requests`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = (await res.json()) as { success: boolean; data?: PaymentRequestDto[] }
    if (!json.success || !json.data) return null
    return json.data
  } catch (error) {
    console.error('[admin-payment-requests] Failed to fetch payment requests', error)
    return null
  }
}




export const dynamic = 'force-dynamic'
export default async function PaymentRequestsPage() {
  await requireAdmin()
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/admin/login')
  }

  const data = await fetchPaymentRequests()

  const pendingCount = data?.filter((r) => r.status === 'pending').length ?? 0
  const approvedCount = data?.filter((r) => r.status === 'approved').length ?? 0
  const rejectedCount = data?.filter((r) => r.status === 'rejected').length ?? 0

  const hasData = data && data.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Payment Requests</h1>
          <p className="mt-1 text-neutral-600">
            Review UPI proof uploads and approve or reject course and project access.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center justify-between border-2 border-amber-200 bg-amber-50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
          </div>
        </Card>
        <Card className="flex items-center justify-between border-2 border-emerald-200 bg-emerald-50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-emerald-700">{approvedCount}</p>
          </div>
        </Card>
        <Card className="flex items-center justify-between border-2 border-rose-200 bg-rose-50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold text-rose-700">{rejectedCount}</p>
          </div>
        </Card>
      </div>

      {!hasData ? (
        <AdminStateMessage
          tone="info"
          title="No payment requests yet"
          description="When students submit UPI payment proofs for premium courses or projects, they will appear here for review."
        />
      ) : (
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading payment requests…</div>}>
          <PaymentRequestsTable initialData={data ?? []} />
        </Suspense>
      )}
    </div>
  )
}
