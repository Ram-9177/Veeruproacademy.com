import { ComponentProps } from 'react'
import { Container } from './Container'
import { cn } from '@/lib/utils'

export function SectionWrapper({ className, children, ...props }: ComponentProps<'section'>) {
  return (
    <section className={cn('py-12 md:py-16 lg:py-20', className)} {...props}>
      <Container>{children}</Container>
    </section>
  )
}
