/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './data/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        // EDUCATION THEME - PROFESSIONAL & ATTRACTIVE
        // Primary: Education Blue - Trust, Knowledge, Stability
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Primary - Main brand color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#2563eb',
        },
        // Secondary: Success Green - Growth, Achievement, Progress
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Success/Secondary
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          DEFAULT: '#10b981',
        },
        // Accent: Energy Orange - Motivation, Highlights, CTAs
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Accent
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        // Tertiary: Creative Purple - Innovation, Premium, Special
        tertiary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          DEFAULT: '#8b5cf6',
        },
        // Direct Palette References
        pistachio: '#B1CFB7',
        vanilla: '#EFD9AA',
        polarSky: '#B3D9E1',
        lilac: '#D7C2D8',
        apricot: '#EFBA93',

        // Neutral: Polar Sky (Cool Blue-Grey)
        neutral: {
          50: '#f4f9fb',
          100: '#e6f2f6',
          200: '#d1e6ed',
          300: '#b3d9e1', // Polar Sky
          400: '#92c0cc',
          500: '#72a3b0',
          600: '#588390',
          700: '#466873',
          800: '#3a535c',
          900: '#32454d',
          DEFAULT: '#72a3b0',
        },
        // Semantic Colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Success
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          DEFAULT: '#10b981',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Warning
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Error
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ef4444',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Info
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6',
        },
        
        // Professional Neutrals - Slate Gray scale
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          DEFAULT: '#64748b',
        },
        
    // Semantic tokens
    foreground: '#f5f7ff',
    muted: '#9ea6bb',
    'muted-foreground': '#9ea6bb',
    border: 'rgba(255,255,255,0.16)',
    input: 'rgba(18,22,32,0.85)',
    ring: '#7d86ff',
    background: '#060910',
        
        // Legacy support (mapping to new theme)
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          DEFAULT: '#14b8a6',
        },
        coral: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        warm: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        sunny: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        cyan: colors.cyan,
        
        // Map brand/navy to Deep Polar Sky (Slate) for contrast
        brand: {
          50: '#f4f9fb',
          100: '#e6f2f6',
          200: '#d1e6ed',
          300: '#b3d9e1',
          400: '#92c0cc',
          500: '#72a3b0',
          600: '#588390',
          700: '#466873',
          800: '#3a535c',
          900: '#32454d',
          DEFAULT: '#3a535c',
        },
        navy: {
          50: '#f4f9fb',
          100: '#e6f2f6',
          200: '#d1e6ed',
          300: '#b3d9e1',
          400: '#92c0cc',
          500: '#72a3b0',
          600: '#588390',
          700: '#466873',
          800: '#3a535c',
          900: '#32454d',
          DEFAULT: '#3a535c',
        },
        
        cream: { DEFAULT: '#fdf8f4' }, // Map to very light Apricot tint
        
  // Semantic Colors
  surface: '#111724',
  'text-primary': '#f5f7ff',
  'text-muted': '#9ea6bb',
  'border-subtle': 'rgba(255,255,255,0.12)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        'section': '5rem',
        'section-sm': '3rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(58 83 92 / 0.05), 0 1px 2px -1px rgb(58 83 92 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(58 83 92 / 0.1), 0 2px 4px -2px rgb(58 83 92 / 0.05)',
        'elevated': '0 10px 15px -3px rgb(58 83 92 / 0.1), 0 4px 6px -4px rgb(58 83 92 / 0.05)',
        'blob': '0 25px 50px -12px rgb(58 83 92 / 0.25)',
      },
      backgroundImage: {
        // Soft Pastel Gradients
        'hero-gradient': 'linear-gradient(135deg, #f4f9f5 0%, #fdf8f4 50%, #fbf8fc 100%)', // Light Pistachio -> Light Apricot -> Light Lilac
        'teal-gradient': 'linear-gradient(135deg, #B1CFB7 0%, #92b89a 100%)', // Pistachio Gradient
        'orange-gradient': 'linear-gradient(135deg, #EFBA93 0%, #e69a6d 100%)', // Apricot Gradient
        'navy-gradient': 'linear-gradient(135deg, #3a535c 0%, #588390 100%)', // Polar Sky Deep Gradient
        'hero-blueMint': 'linear-gradient(135deg, #B3D9E1 0%, #B1CFB7 50%, #EFD9AA 100%)', // Polar Sky -> Pistachio -> Vanilla
        'rainbow-soft': 'linear-gradient(135deg, #B1CFB7 0%, #B3D9E1 25%, #D7C2D8 50%, #EFBA93 75%, #EFD9AA 100%)', // All colors
      },
      lineHeight: {
        'extra-tight': '1.1',
        'tight': '1.2',
        'snug': '1.3',
        'normal': '1.5',
        'relaxed': '1.75',
        'loose': '1.8',
        'extra-loose': '2',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out infinite 0.5s',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config;
