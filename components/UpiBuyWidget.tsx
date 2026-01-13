/**
 * Purpose: Client-side UPI payment widget.
 *
 * API:
 *   <UpiBuyWidget amount={499} projectId="sample-project" />
 *
 * Behavior:
 *  - Generates traceable orderId (ORD-YYYYMMDD-XXXX)
 *  - Builds upi:// link with pa,pn,am,tn,cu
 *  - Renders QR code and copyable link
 *  - Prefills evidence form with orderId & amount via query string
 */
import React, { useEffect, useMemo, useState } from "react";
import { QRCodeSVG as QRCode } from "qrcode.react";

type Props = {
  amount: number;
  merchantUpi?: string;
  merchantName?: string;
  evidenceFormUrl?: string;
  onOrderCreated?: (_orderId: string) => void;
};

function makeOrderId() {
  const d = new Date();
  const date = d.toISOString().slice(0, 10).replace(/-/g, "");
  const rnd = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${date}-${rnd}`;
}

export default function UpiBuyWidget({ amount, merchantUpi, merchantName, evidenceFormUrl, onOrderCreated }: Props) {
  const envUpi = process.env.NEXT_PUBLIC_MERCHANT_UPI;
  const envName = process.env.NEXT_PUBLIC_MERCHANT_NAME;
  const evidenceEnv = process.env.NEXT_PUBLIC_PAYMENT_EVIDENCE_FORM_URL;

  const _orderId = useMemo(() => makeOrderId(), []);
    useEffect(() => { onOrderCreated && onOrderCreated(_orderId); }, [onOrderCreated, _orderId]);

  const [siteSettings, setSiteSettings] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' })
        if (!res.ok) return
        const json = await res.json()
        if (mounted) setSiteSettings(json?.settings ?? null)
      } catch (e) {
        console.debug('site-settings fetch failed', e)
      }
    })()
    return () => { mounted = false }
  }, []);

  const pa = merchantUpi || envUpi || siteSettings?.merchant_upi || "";
  const pn = merchantName || envName || siteSettings?.merchant_name || "Veeru's Pro Academy";
  const evidenceBase = evidenceFormUrl || evidenceEnv || siteSettings?.payment_form_url || "";

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({ pa, pn, am: String(amount), tn: `ORDER-${_orderId}`, cu: "INR" });
    return `upi://pay?${params.toString()}`;
  }, [pa, pn, amount, _orderId]);

  const evidenceUrl = useMemo(() => {
    if (!evidenceBase) return "";
    try { const u = new URL(evidenceBase); u.searchParams.set("orderId", _orderId); u.searchParams.set("amount", String(amount)); return u.toString(); }
    catch { return `${evidenceBase}?orderId=${encodeURIComponent(_orderId)}&amount=${amount}`; }
  }, [evidenceBase, _orderId, amount]);

  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  useEffect(() => { const it = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000); return () => clearInterval(it); }, []);
  const minutes = Math.floor(secondsLeft / 60); const seconds = secondsLeft % 60;

  const [copied, setCopied] = useState(false);
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.debug('copy failed', e);
    }
  };

  return (
    <div className="card bg-card border border-border">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-none">
          <div className="w-40 h-40 bg-white rounded-lg border flex items-center justify-center p-2">
            <QRCode value={upiLink} size={140} bgColor="var(--background)" fgColor="var(--foreground)" />
          </div>
          <div className="mt-2 text-center text-xs text-muted-foreground"><span className="font-medium">{minutes}:{String(seconds).padStart(2, '0')}</span> QR valid</div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pay ₹{amount}</h3>
              <p className="text-sm text-muted-foreground mt-1">Order: <code>{_orderId}</code></p>
            </div>
            <div><span className="badge">Manual UPI</span></div>
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium text-muted-foreground">UPI link</label>
            <div className="mt-1 flex gap-2 items-center">
              <input readOnly value={upiLink} className="w-full rounded border border-border bg-input px-2 py-2 text-foreground" aria-label="UPI payment link" />
              <button className="btn btn-outline" onClick={() => copyToClipboard(upiLink)} aria-live="polite">{copied ? "Copied" : "Copy"}</button>
            </div>
              <p className="mt-2 text-sm text-muted-foreground">Use the UPI note to include <strong>{_orderId}</strong>. After payment, open the evidence form and upload a screenshot.</p>

            {evidenceUrl ? (
              <div className="mt-3 flex gap-2">
                <a className="btn btn-primary" href={evidenceUrl} target="_blank" rel="noreferrer">Open Evidence Form</a>
                <a className="btn btn-outline" href="/admin">Contact Admin</a>
              </div>
            ) : (
              <div className="mt-3 text-sm text-yellow-500">Evidence form URL not configured. Admin: set NEXT_PUBLIC_PAYMENT_EVIDENCE_FORM_URL or update Admin → Settings.</div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
