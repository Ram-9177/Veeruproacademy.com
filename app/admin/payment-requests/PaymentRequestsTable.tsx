'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'

import { Button } from '@/app/components/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { PaymentRequestReviewDialog } from './PaymentRequestReviewDialog'
import type { PaymentRequestDto } from '@/app/api/admin/payment-requests/route'

function StatusBadge({ status }: { status: PaymentRequestDto['status'] }) {
  const variants: Record<PaymentRequestDto['status'], string> = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    approved: 'bg-green-500/10 text-green-500',
    rejected: 'bg-red-500/10 text-red-500',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variants[status]}`}>
      {status.toUpperCase()}
    </span>
  )
}

export function PaymentRequestsTable({ initialData }: { initialData: PaymentRequestDto[] }) {
  const [selected, setSelected] = useState<PaymentRequestDto | null>(null)
  const [open, setOpen] = useState(false)

  const handleReview = (req: PaymentRequestDto) => {
    setSelected(req)
    setOpen(true)
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Student email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Submitted at</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-mono text-xs max-w-[160px] truncate">{req.id}</TableCell>
                <TableCell className="font-medium">{req.itemType}</TableCell>
                <TableCell className="font-medium">
                  {req.project?.title ?? req.course?.title ?? 'Unknown'}
                </TableCell>
                <TableCell>{req.userEmail}</TableCell>
                <TableCell>₹{req.amount}</TableCell>
                <TableCell>{req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={req.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleReview(req)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selected && <PaymentRequestReviewDialog request={selected} open={open} onOpenChange={setOpen} />}
    </>
  )
}
