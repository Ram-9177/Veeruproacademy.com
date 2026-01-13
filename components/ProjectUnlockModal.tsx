'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Download, CreditCard, CheckCircle2, ShieldAlert, Loader2, Upload } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { logger } from '@/lib/logger'
import type { ProjectSummary } from '@/src/modules/projects/types'
import { UploadDropzone } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

interface ProjectUnlockModalProps {
  project: ProjectSummary
  open: boolean
  onClose: () => void
  onProjectUpdate: (_project: ProjectSummary) => void
  onProjectError?: () => void
}

type ModalStep = 'overview' | 'payment' | 'success' | 'pending'

export function ProjectUnlockModal(props: ProjectUnlockModalProps) {
  const { project, open, onClose, onProjectUpdate, onProjectError } = props
  const [step, setStep] = useState<ModalStep>('overview')
  const [proofUrl, setProofUrl] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isFree = project.price === 0
  const status = project.unlockStatus
  const hasDriveLink = Boolean(project.driveLink)
  const upiId = project.upiId ?? process.env.NEXT_PUBLIC_MERCHANT_UPI ?? null
  const merchantName = process.env.NEXT_PUBLIC_MERCHANT_NAME ?? 'Veeru\'s Pro Academy'

  useEffect(() => {
    if (!open) return

    setError(null)
    setUploadError(null)
    setProofUrl(null)
    setNotes('')

    if (status === 'unlocked' || status === 'free') {
      setStep('success')
    } else if (status === 'pending') {
      setStep('pending')
    } else {
      setStep('overview')
    }
  }, [open, status, project.slug])

  const submitFreeUnlock = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${project.slug}/unlock`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      })

      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Unable to unlock this project right now.')
      }

      onProjectUpdate(payload.data as ProjectSummary)
      setStep('success')
    } catch (err) {
      logger.error('Free unlock failed', err, { projectSlug: project.slug })
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlock project'
      setError(errorMessage)
      onProjectError?.()
    } finally {
      setSubmitting(false)
    }
  }

  const submitPaidUnlock = async () => {
    if (!proofUrl) {
      setError('Upload a payment screenshot so we can verify your purchase.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${project.slug}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          proofUrl,
          notes: notes.trim() || null,
        }),
      })

      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Unable to submit unlock request. Try again later.')
      }

      const updatedProject = payload.data as ProjectSummary
      onProjectUpdate(updatedProject)
      setStep(updatedProject.unlockStatus === 'pending' ? 'pending' : 'success')
    } catch (err) {
      logger.error('Paid unlock failed', err, { projectSlug: project.slug })
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit unlock request'
      setError(errorMessage)
      onProjectError?.()
    } finally {
      setSubmitting(false)
    }
  }

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <h3 className="mb-2 font-semibold text-emerald-300">{project.title}</h3>
        {isFree ? (
          <p className="text-sm text-emerald-400/80">Access this project instantly – it’s free for Veeru Pro learners.</p>
        ) : (
          <div className="space-y-2 text-sm text-emerald-400/80">
            <p>
              Unlock this premium project for <strong>₹{project.price.toLocaleString('en-IN')}</strong>.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Complete source code</li>
              <li>Google Drive bundle with assets</li>
              <li>Manual review to keep access secure</li>
            </ul>
          </div>
        )}
      </div>

      {project.unlockMetadata?.status === 'rejected' && project.unlockMetadata?.notes && (
        <div className="space-y-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400/80">
          <p className="font-semibold text-red-300">Previous submission reviewed</p>
          <p className="mt-1">{project.unlockMetadata.notes}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-1 w-full border-red-500/50 text-red-300 hover:bg-red-500/20"
            onClick={() => setStep('payment')}
            disabled={submitting}
          >
            Try again with a new screenshot
          </Button>
        </div>
      )}

      {!isFree && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <CreditCard className="mt-0.5 h-5 w-5 text-blue-400" />
          <div className="space-y-1 text-sm text-blue-400/80">
            <h4 className="font-semibold text-blue-300">Pay via PhonePe / GPay / UPI</h4>
            <p>
              Scan the QR code with any UPI app, then upload your payment screenshot for manual verification. Once
              approved, your Google Drive assets unlock automatically.
            </p>
          </div>
        </div>
      )}

      <Button onClick={isFree ? submitFreeUnlock : () => setStep('payment')} className="w-full" disabled={submitting}>
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Unlocking…
          </span>
        ) : isFree ? (
          'Get project assets'
        ) : (
          `Unlock for ₹${project.price.toLocaleString('en-IN')}`
        )}
      </Button>
    </div>
  )

  const renderPayment = () => (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card/50 p-5 text-sm text-muted-foreground">
        <p className="text-center text-foreground font-medium">
          Pay <strong>₹{project.price.toLocaleString('en-IN')}</strong> using PhonePe, GPay, or any UPI app.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="flex h-44 w-44 items-center justify-center rounded-2xl border border-dashed border-border bg-card">
            <span className="text-xs text-muted-foreground">UPI QR code</span>
          </div>
          {upiId && (
            <div className="text-center text-xs text-muted-foreground">
              <p className="font-medium">Merchant: {merchantName}</p>
              <p className="mt-1 break-all">UPI ID: {upiId}</p>
            </div>
          )}
          {!upiId && (
            <p className="text-xs text-muted-foreground">
              UPI ID will be shared on the payment screen or by your mentor.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="space-y-2">
          <label className="mb-1 block text-sm font-medium text-foreground">Upload payment screenshot</label>
          {proofUrl ? (
            <div className="space-y-3">
              <div className="relative h-40 overflow-hidden rounded-xl border border-border">
                <Image
                  src={proofUrl}
                  alt="Payment proof preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-accent"
                onClick={() => setProofUrl(null)}
              >
                Remove uploaded screenshot
              </button>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-5 text-center text-muted-foreground transition hover:border-primary hover:bg-card">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6" />
                <span className="text-xs text-muted-foreground">
                  PNG or JPG up to 8MB. Make sure UPI ID and amount are visible.
                </span>
              </div>
              <div className="mt-3">
                <UploadDropzone<OurFileRouter, 'projectProof'>
                  endpoint="projectProof"
                  onClientUploadComplete={(files) => {
                    const file = files?.[0]
                    if (file?.url) {
                      setProofUrl(file.url)
                      setError(null)
                      setUploadError(null)
                    }
                  }}
                  onUploadError={(err: Error) => {
                    setUploadError(err.message)
                  }}
                />
              </div>
            </div>
          )}
          {uploadError && (
            <p className="text-xs text-red-400">{uploadError}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Additional notes (optional)</label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="h-24 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Include transaction ID or any detail that helps us verify faster."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => setStep('overview')} disabled={submitting}>
          Back
        </Button>
        <Button className="flex-1" onClick={submitPaidUnlock} disabled={submitting}>
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </span>
          ) : (
            'Submit for review'
          )}
        </Button>
      </div>
    </div>
  )

  const renderPending = () => (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Unlock request received</h3>
        <p className="text-sm text-muted-foreground">
          We’re reviewing your payment proof. You’ll get an email once the Google Drive bundle is unlocked.
        </p>
        {project.unlockMetadata?.notes && (
          <p className="text-xs text-muted-foreground/80">Admin notes: {project.unlockMetadata.notes}</p>
        )}
      </div>
      {project.unlockMetadata?.proofUrl && (
        <div className="mx-auto max-w-xs space-y-2 text-left text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Uploaded screenshot</p>
          <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-card/50">
            <Image
              src={project.unlockMetadata.proofUrl}
              alt="Uploaded payment proof"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
        </div>
      )}
      <div className="space-y-3">
        <Button href="/dashboard" variant="primary" className="w-full" onClick={onClose}>
          Back to dashboard
        </Button>
        <Button variant="outline" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Project unlocked!</h3>
        <p className="text-sm text-muted-foreground">
          You now have permanent access to every asset bundled with this project.
        </p>
      </div>
      <div className="space-y-3">
        {hasDriveLink && (
          <Button href={project.driveLink ?? '#'} target="_blank" rel="noreferrer" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Open Google Drive folder
          </Button>
        )}
        <Button variant="outline" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog.Root open={open} onOpenChange={(value) => {
      if (!value) {
        onClose()
      }
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-2xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {status === 'unlocked' || status === 'free'
                ? 'Access project assets'
                : status === 'pending'
                ? 'Unlock in review'
                : 'Unlock premium project'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4 p-6">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <ShieldAlert className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {step === 'overview' && renderOverview()}
            {step === 'payment' && renderPayment()}
            {step === 'pending' && renderPending()}
            {step === 'success' && renderSuccess()}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
