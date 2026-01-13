"use client"

import React, { createContext, useContext } from 'react'

type CelebrationContextValue = {}

const CelebrationContext = createContext<CelebrationContextValue | undefined>(undefined)

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const value: CelebrationContextValue = {}
  return (
    <CelebrationContext.Provider value={value}>
      {children}
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const context = useContext(CelebrationContext)
  if (!context) {
    throw new Error('useCelebration must be used within CelebrationProvider')
  }
  return context
}
