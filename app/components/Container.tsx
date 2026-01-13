import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10', className)} {...props} />
}
