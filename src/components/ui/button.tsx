import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background backdrop-blur-md",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary/90 via-[#7d86ff] to-primary/80 text-white shadow-[0_18px_36px_rgba(77,90,255,0.35)] hover:shadow-[0_22px_44px_rgba(77,90,255,0.45)] hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-[#f87171] to-[#ef4444] text-white shadow-[0_18px_36px_rgba(239,68,68,0.35)] hover:shadow-[0_22px_44px_rgba(239,68,68,0.45)]",
        outline:
          "border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface/10 shadow-[0_12px_28px_rgba(5,8,18,0.28)]",
        secondary:
          "bg-surface/12 text-white hover:bg-surface/16 border border-border shadow-[0_16px_32px_rgba(5,8,18,0.32)]",
        ghost:
          "text-muted-foreground/70 hover:text-foreground hover:bg-surface/10",
        link: "text-primary-200 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-9 rounded-xl gap-1.5 px-4",
        lg: "h-12 rounded-2xl px-8",
        icon: "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
