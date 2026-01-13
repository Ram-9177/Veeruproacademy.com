"use client"

import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { formatPrice } from '@/lib/utils'
import type { ProjectSummary } from '@/src/modules/projects/types'
import { UnlockStatusBanner } from '@/src/components/UnlockStatusBanner'
import UpiBuyWidget from '@/components/UpiBuyWidget'

type PaymentPanelProps = {
  project: ProjectSummary
  onUnlock: () => void
  busy?: boolean
}

export function PaymentPanel({ project, onUnlock, busy = false }: PaymentPanelProps) {
  const isFree = project.price === 0
  const unlockStatus = project.unlockStatus
  const isUnlocked = unlockStatus === 'free' || unlockStatus === 'unlocked'
  const isPending = unlockStatus === 'pending'

  return (
    <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-md p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Access
          </div>
          <div className="font-display text-2xl font-semibold text-foreground">
            {isFree ? 'Free download' : formatPrice(project.price)}
          </div>
        </div>
        <Badge tone={isUnlocked ? 'green' : isPending ? 'gold' : isFree ? 'secondary-1' : 'primary'}>
          {isUnlocked ? 'Unlocked' : isPending ? 'Pending review' : isFree ? 'Free' : 'UPI payment'}
        </Badge>
      </div>

      {isUnlocked ? (
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          {project.driveLink ? (
            <>
              <p>Access your Google Drive bundle instantly.</p>
              <Button
                href={project.driveLink}
                variant="secondary-1"
                className="w-full"
                icon={<ArrowUpRight className="h-4 w-4" />}
                target="_blank"
                rel="noreferrer"
              >
                Open Drive assets
              </Button>
            </>
          ) : (
            <div className="space-y-2 rounded-2xl border border-border/40 bg-muted p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Assets coming soon</p>
              <p>Your payment is approved, but the Google Drive link hasn&apos;t been attached yet. You&apos;ll see the download button here once it&apos;s ready.</p>
            </div>
          )}
        </div>
      ) : isPending ? (
        <div className="mt-6 space-y-4">
          <UnlockStatusBanner
            status={unlockStatus}
            notes={project.unlockMetadata?.notes}
            proofUrl={project.unlockMetadata?.proofUrl}
          />
          <Button variant="outline" className="w-full" onClick={onUnlock}>
            View submission
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {project.upiId ? (
            <UpiBuyWidget amount={project.price} merchantUpi={project.upiId} merchantName="Veeru's Pro Academy" evidenceFormUrl={project.formUrl ?? undefined} />
          ) : (
            <div className="rounded-2xl border border-border/40 bg-muted p-4 text-sm text-muted-foreground">
              PhonePe/UPI scanner will appear once an admin sets the merchant UPI in the project settings.
            </div>
          )}
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">After payment</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Upload your payment proof using the unlock form.</li>
              <li>We verify manually and unlock the Google Drive bundle.</li>
            </ol>
            <Button
              onClick={onUnlock}
              variant="outline"
              className="w-full"
              icon={<ArrowUpRight className="h-4 w-4" />}
              disabled={busy}
            >
              {busy ? 'Opening unlock form…' : 'Upload payment proof'}
            </Button>
            {project.formUrl && (
              <div className="rounded-xl border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                Google Form reference:{' '}
                <a className="text-primary underline" href={project.formUrl} target="_blank" rel="noreferrer">
                  {project.formUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {project.unlockMetadata?.proofUrl && (
        <div className="mt-6 rounded-2xl border border-border bg-muted p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>Proof uploaded on {project.unlockMetadata.submittedAt ? new Date(project.unlockMetadata.submittedAt).toLocaleString() : '—'}</span>
          </div>
          <a
            href={project.unlockMetadata.proofUrl ?? '#'}
            target="_blank"
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-foreground transition hover:bg-muted"
            rel="noreferrer"
          >
            View uploaded proof
          </a>
        </div>
      )}
    </div>
  )
}
