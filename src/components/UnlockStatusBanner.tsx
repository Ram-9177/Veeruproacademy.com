import { Badge } from "./ui/badge";

export type UnlockStatusBannerProps = {
  status: "free" | "locked" | "pending" | "unlocked";
  notes?: string | null;
  proofUrl?: string | null;
};

export function UnlockStatusBanner({ status, notes, proofUrl }: UnlockStatusBannerProps) {
  if (status === "free" || status === "unlocked") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
        <Badge variant="default">Unlocked</Badge>
        <span>Drive assets are available for this project.</span>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Pending review</Badge>
          <span>Your payment proof is being reviewed.</span>
        </div>
        {notes && <p className="text-xs text-amber-800">Admin notes: {notes}</p>}
        {proofUrl && (
          <p className="text-xs text-amber-700">
            Screenshot uploaded. You will receive an email once access is approved.
          </p>
        )}
      </div>
    );
  }

  // locked
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
      <Badge variant="outline">Locked</Badge>
      <span>Unlock this project with a one-time UPI payment.</span>
    </div>
  );
}
