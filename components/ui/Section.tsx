import React from 'react'
import clsx from 'clsx'
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padded?: boolean
  id?: string
}
export function Section({ padded=true, className, id, ...rest }: SectionProps) {
  return <section id={id} className={clsx(padded && 'py-12 sm:py-16', className)} {...rest} />
}
export default Section
