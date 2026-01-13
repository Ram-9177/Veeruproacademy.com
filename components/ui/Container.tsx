import React from 'react'
import clsx from 'clsx'
export function Container({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mx-auto w-full max-w-7xl px-4 sm:px-6', className)} {...rest} />
}
export default Container
