import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
  "flex h-11 w-full min-w-0 rounded-2xl border border-border bg-surface/10 px-4 py-2 text-base text-foreground placeholder:text-muted-foreground transition-[color,box-shadow] outline-none file:inline-flex file:h-9 file:rounded-xl file:border file:border-border file:bg-surface/10 file:px-4 file:text-sm file:font-semibold file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm backdrop-blur-md",
        "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/40",
        "aria-invalid:border-[#f87171] aria-invalid:ring-[#f87171]/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
