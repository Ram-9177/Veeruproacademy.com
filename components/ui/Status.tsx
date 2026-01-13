"use client";

import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", description, children }: { title?: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="text-center p-10 rounded-xl border-2 border-border bg-card/50">
      <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary text-xl">•</span>
      </div>
      <h3 className="text-lg font-semibold mb-1 text-foreground">{title}</h3>
      {description ? <p className="text-sm text-muted-foreground mb-4">{description}</p> : null}
      {children}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, retry }: { title?: string; description?: string; retry?: () => void }) {
  return (
    <div className="text-center p-10 rounded-xl border-2 border-destructive/30 bg-destructive/5">
      <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
        <span className="text-destructive text-xl">!</span>
      </div>
      <h3 className="text-lg font-semibold mb-1 text-destructive-foreground">{title}</h3>
      {description ? <p className="text-sm text-muted-foreground mb-4">{description}</p> : null}
      {retry ? (
        <button onClick={retry} className="btn btn-primary btn-sm">Try again</button>
      ) : null}
    </div>
  );
}
