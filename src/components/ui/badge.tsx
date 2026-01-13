import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils.ts";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden backdrop-blur",
  {
    variants: {
      variant: {
        default:
         "border-border bg-surface/10 text-foreground [a&]:hover:bg-surface/16",
        secondary:
         "border-border bg-gradient-to-r from-card/8 to-card/4 text-muted-foreground [a&]:hover:from-card/12 [a&]:hover:to-card/8",
        destructive:
          "border-destructive/30 bg-destructive/15 text-destructive-foreground [a&]:hover:bg-destructive/25",
        outline:
         "border-border text-muted-foreground [a&]:hover:bg-surface/10 [a&]:hover:text-foreground",
      },
      tone: {
        default: "",
        success: "border-green-500/40 bg-green-500/15 text-green-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  tone = "default",
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; tone?: string }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, tone }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
