'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Check, X as XIcon } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import type { PaymentRequestDto } from '@/app/api/admin/payment-requests/route'

interface PaymentRequestReviewDialogProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  request: PaymentRequestDto | null
}

export function PaymentRequestReviewDialog({ open, onOpenChange, request }: PaymentRequestReviewDialogProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState<'approved' | 'rejected' | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  if (!request) {
    return null
  }

  const handleDecision = async (status: 'approved' | 'rejected') => {
    setSubmitting(status)
    try {
      const res = await fetch('/api/admin/payment-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: request.id, status, adminNotes: adminNotes.trim() || null }),
      })

      if (!res.ok) {
        // Best-effort: log to console; admin UI will stay open
        console.error('[PaymentRequestReviewDialog] Failed to update payment request', await res.text())
        return
      }

      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error('[PaymentRequestReviewDialog] Error updating payment request', error)
    } finally {
      setSubmitting(null)
    }
  }

  const statusTone: Record<PaymentRequestDto['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    pending: { label: 'Pending', variant: 'secondary' },
    approved: { label: 'Approved', variant: 'default' },
    rejected: { label: 'Rejected', variant: 'destructive' },
  }

  const tone = statusTone[request.status]
  const itemLabel = request.itemType === 'COURSE' ? 'Course' : 'Project'
  const itemTitle = request.course?.title ?? request.project?.title ?? 'Unknown'
  const itemSlug = request.course?.slug ?? request.project?.slug ?? ''
  const itemPath = itemSlug
    ? request.itemType === 'COURSE'
      ? `/courses/${itemSlug}`
      : `/projects/${itemSlug}`
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Payment Request</DialogTitle>
          <DialogDescription>
            Confirm the UPI payment screenshot and details before approving access.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Request ID</p>
                <p className="font-mono text-sm break-all">{request.id}</p>
              </div>
              <Badge variant={tone.variant}>{tone.label}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Student</p>
                <p className="font-medium">{request.userName ?? 'Unknown'}</p>
                <p className="text-xs text-muted-foreground break-all">{request.userEmail ?? 'No email'}</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">{itemLabel}</p>
                <p className="font-medium">{itemTitle}</p>
                {itemPath && (
                  <p className="text-xs text-muted-foreground break-all">{itemPath}</p>
                )}
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-semibold text-lg">₹{request.amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Submitted at</p>
                <p className="text-sm">
                  {request.submittedAt ? new Date(request.submittedAt).toLocaleString() : 'Not recorded'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Admin notes (optional)</span>
              </div>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Add context for approval or rejection. These notes are stored with the payment request."
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Payment Screenshot</p>
            {request.screenshotUrl ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-background">
                <Image
                  src={request.screenshotUrl}
                  alt="Payment screenshot"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                No screenshot attached
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:order-1"
          >
            <XIcon className="mr-1 h-4 w-4" />
            Close
          </Button>
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={submitting !== null}
              onClick={() => handleDecision('rejected')}
            >
              <XIcon className="mr-1 h-4 w-4" />
              {submitting === 'rejected' ? 'Rejecting…' : 'Reject'}
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={submitting !== null}
              onClick={() => handleDecision('approved')}
            >
              <Check className="mr-1 h-4 w-4" />
              {submitting === 'approved' ? 'Approving…' : 'Approve'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
