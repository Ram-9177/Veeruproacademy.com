'use client'

interface AttractiveBackgroundProps {
  className?: string
}

export function AttractiveBackground({ className = '' }: AttractiveBackgroundProps) {
  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`} 
      style={{ zIndex: -10 }}
    >
      {/* Professional subtle background */}
      <div className="absolute inset-0 bg-blue-600/3" />
      
      {/* Subtle ambient lighting circles */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl opacity-60"
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl opacity-60" 
      />
      
      {/* Center professional accent */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/4 rounded-full blur-3xl opacity-50" 
      />
    </div>
  )
}