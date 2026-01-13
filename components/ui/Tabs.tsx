"use client"
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export const TabsList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)} {...props} />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn('inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} {...props} />
))
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn('mt-4 focus-visible:outline-none', className)} {...props} />
))
TabsContent.displayName = 'TabsContent'
