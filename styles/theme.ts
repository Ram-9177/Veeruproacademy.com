/**
 * Premium Theme System - Inspired by smru.in
 * Deep Navy + Royal Blue gradient aesthetic
 * Minimal white with premium spacing & shadows
 */

export const colors = {
  brand: {
    primary: '#3B82F6',      // Bright Blue (primary)
    accent: '#60A5FA',       // Light Blue (accent)
    light: '#FFFFFF',        // Pure white/surface
    dark: '#1F2937',         // Dark text
    surface: '#F9FAFB',      // Light gray backgrounds
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
}

export const gradients = {
  primary: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
  accent: 'linear-gradient(135deg, #60A5FA 0%, #93C5FD 100%)',
  subtle: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
  soft: 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, rgba(96, 165, 250, 0.05) 100%)',
}

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.08)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  elevated: '0 8px 24px -2px rgba(15, 30, 84, 0.15)',
  floating: '0 12px 40px -8px rgba(45, 86, 247, 0.2)',
  premium: '0 20px 40px -12px rgba(15, 30, 84, 0.25)',
}

export const spacing = {
  xs: '4px',    // 8/2
  sm: '8px',    // 8
  md: '12px',   // 12
  lg: '16px',   // 16
  xl: '24px',   // 24
  '2xl': '32px', // 32
  '3xl': '40px', // 40
  '4xl': '48px', // 48
  '5xl': '64px', // 64
}

export const typography = {
  scale: {
    xs: { size: '12px', lineHeight: '16px', weight: 400 },
    sm: { size: '14px', lineHeight: '20px', weight: 400 },
    base: { size: '16px', lineHeight: '24px', weight: 400 },
    lg: { size: '18px', lineHeight: '28px', weight: 500 },
    xl: { size: '20px', lineHeight: '30px', weight: 600 },
    '2xl': { size: '24px', lineHeight: '32px', weight: 700 },
    '3xl': { size: '30px', lineHeight: '36px', weight: 700 },
    '4xl': { size: '36px', lineHeight: '44px', weight: 800 },
    '5xl': { size: '48px', lineHeight: '56px', weight: 800 },
  }
}

export const animations = {
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  }
}

export const radius = {
  sm: '4px',    // inputs
  md: '8px',    // small cards
  lg: '12px',   // medium cards
  xl: '16px',   // large cards & buttons
  '2xl': '20px', // premium cards
  full: '9999px', // pills
}

// Legacy tokens for compatibility
const tokens = {
  colors: colors.brand,
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radii: { base: '12px' },
  elevation: { soft: shadows.base },
  motion: { fast: '120ms', normal: '180ms', slow: '300ms' }
} as const

export const themes = {
  light: {
    colors: {
      background: '#FFFFFF',
      text: '#1F2937',
      primary: '#3B82F6',
      accent: '#60A5FA',
    },
  },
};

export default tokens

