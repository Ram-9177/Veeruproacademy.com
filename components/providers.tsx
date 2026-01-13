'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps as NextThemesProviderProps } from 'next-themes/dist/types';
import * as React from 'react';

interface ThemeProviderProps extends Omit<NextThemesProviderProps, 'children'> {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
