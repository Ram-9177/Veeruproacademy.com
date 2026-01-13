import React from 'react';

interface BackgroundPatternProps {
  variant?: 'grid' | 'dots' | 'lines';
  className?: string;
}

/**
 * Clean, subtle background patterns for light theme
 * No gradients, no colors - just geometric shapes with low opacity
 */
export function BackgroundPattern({ variant = 'grid', className = '' }: BackgroundPatternProps) {
  const patterns = {
    // Multi-line square grid - clean and corporate
    grid: (
      <svg 
        className={`absolute inset-0 w-full h-full ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="grid-pattern" 
            x="0" 
            y="0" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="rgba(148, 163, 184, 0.12)" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    ),
    
    // Subtle dot pattern
    dots: (
      <svg 
        className={`absolute inset-0 w-full h-full ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="dots-pattern" 
            x="0" 
            y="0" 
            width="24" 
            height="24" 
            patternUnits="userSpaceOnUse"
          >
            <circle 
              cx="2" 
              cy="2" 
              r="1" 
              fill="rgba(148, 163, 184, 0.12)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-pattern)" />
      </svg>
    ),
    
    // Thin diagonal lines
    lines: (
      <svg 
        className={`absolute inset-0 w-full h-full ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="lines-pattern" 
            x="0" 
            y="0" 
            width="20" 
            height="20" 
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="20" 
              stroke="rgba(148, 163, 184, 0.12)" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lines-pattern)" />
      </svg>
    ),
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {patterns[variant]}
    </div>
  );
}
