"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-[36px] border border-white/20 p-[3px] text-muted-foreground shadow-[0_25px_70px_rgba(4,6,23,0.85)] bg-gradient-to-br from-[hsl(var(--aurora-blue)/0.3)] via-[hsl(var(--aurora-purple)/0.25)] to-[hsl(var(--aurora-teal)/0.3)] backdrop-blur-[28px] relative overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[30px] border border-white/25 bg-[hsl(var(--card)/0.5)] px-4 py-1.5 text-sm font-semibold text-muted-foreground transition-all duration-300 shadow-[0_18px_45px_rgba(10,12,35,0.8)] backdrop-blur-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:pointer-events-none disabled:opacity-60 data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-[hsl(var(--primary)/0.9)] data-[state=active]:via-[hsl(var(--secondary-2)/0.7)] data-[state=active]:to-[hsl(var(--secondary-3)/0.65)] data-[state=active]:text-foreground data-[state=active]:shadow-[0_25px_65px_rgba(59,130,246,0.45)] data-[state=active]:backdrop-blur-[40px]",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
