"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

/**
 * Polls the appropriate API endpoint for unlock status changes and
 * triggers a soft refresh when the status transitions (e.g. pending -> unlocked).
 */
export function useUnlockRefresh(
  resourceType: "project" | "course",
  slug: string,
  unlockStatus: "free" | "locked" | "pending" | "unlocked",
) {
  const router = useRouter();
  const endpoint = useMemo(() => (
    resourceType === "project" ? `/api/projects/${slug}` : `/api/courses/${slug}`
  ), [resourceType, slug]);

  useEffect(() => {
    if (!slug) return;
    if (unlockStatus !== "pending") return;

    let cancelled = false;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as { success: boolean; data?: { unlockStatus?: string } };
        if (!json.success || !json.data || cancelled) return;
        const next = json.data.unlockStatus as typeof unlockStatus | undefined;
        if (next && next !== unlockStatus) {
          router.refresh();
        }
      } catch (error) {
        console.error("[useUnlockRefresh] Polling failed", error);
      }
    }, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [endpoint, unlockStatus, router, slug]);
}
