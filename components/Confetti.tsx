"use client"

import { useEffect, useState, useCallback } from 'react'

const CONFETTI_COLORS = [
  '#10B981', // emerald
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#FFD700', // gold
  '#00CED1', // dark cyan
]

const SHAPES = ['square', 'circle', 'triangle'] as const
type Shape = typeof SHAPES[number]

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  delay: number
  size: number
  shape: Shape
  velocityX: number
  velocityY: number
  spin: number
}

interface ConfettiProps {
  trigger: boolean
  duration?: number
  particleCount?: number
  spread?: number
  origin?: { x: number; y: number }
}

// Global CSS for confetti animations - injected once
const confettiStyles = `
@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(var(--spin, 720deg)) scale(0.5);
    opacity: 0;
  }
}
@keyframes confettiSwing {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(var(--swing, 30px)); }
  75% { transform: translateX(calc(-1 * var(--swing, 30px))); }
}
@keyframes burstOut {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0);
    opacity: 0;
  }
}
`

// Inject styles once
let stylesInjected = false
function injectStyles() {
  if (typeof document === 'undefined' || stylesInjected) return
  const styleEl = document.createElement('style')
  styleEl.id = 'confetti-styles'
  styleEl.textContent = confettiStyles
  document.head.appendChild(styleEl)
  stylesInjected = true
}

export function Confetti({ 
  trigger, 
  duration = 4000, 
  particleCount = 80,
  spread = 100,
  origin = { x: 50, y: 30 }
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  // Inject styles on mount
  useEffect(() => {
    injectStyles()
  }, [])

  const createParticles = useCallback(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: origin.x + (Math.random() - 0.5) * spread,
      y: origin.y,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 300,
      size: Math.random() * 8 + 4,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      velocityX: (Math.random() - 0.5) * 15,
      velocityY: Math.random() * -15 - 5,
      spin: (Math.random() - 0.5) * 720,
    }))
  }, [particleCount, spread, origin])

  useEffect(() => {
    if (!trigger) {
      setIsActive(false)
      const fadeTimer = setTimeout(() => setParticles([]), 500)
      return () => clearTimeout(fadeTimer)
    }

    setIsActive(true)
    setParticles(createParticles())

    const timer = setTimeout(() => {
      setIsActive(false)
      setTimeout(() => setParticles([]), 500)
    }, duration)

    return () => clearTimeout(timer)
  }, [trigger, duration, createParticles])

  if (particles.length === 0) return null

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[9999] overflow-hidden transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.shape !== 'triangle' ? particle.color : 'transparent',
            borderRadius: particle.shape === 'circle' ? '50%' : particle.shape === 'square' ? '2px' : '0',
            borderLeft: particle.shape === 'triangle' ? `${particle.size / 2}px solid transparent` : undefined,
            borderRight: particle.shape === 'triangle' ? `${particle.size / 2}px solid transparent` : undefined,
            borderBottom: particle.shape === 'triangle' ? `${particle.size}px solid ${particle.color}` : undefined,
            '--spin': `${particle.spin}deg`,
            '--swing': `${Math.abs(particle.velocityX) * 3}px`,
            animation: `confettiFall ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${particle.delay}ms forwards, confettiSwing ${duration / 4}ms ease-in-out ${particle.delay}ms infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// Burst confetti from a specific point (e.g., button click)
export function ConfettiBurst({ 
  trigger, 
  x, 
  y,
  particleCount = 30,
  duration = 2000 
}: { 
  trigger: boolean
  x: number
  y: number
  particleCount?: number
  duration?: number
}) {
  const [particles, setParticles] = useState<Particle[]>([])

  // Inject styles on mount
  useEffect(() => {
    injectStyles()
  }, [])

  useEffect(() => {
    if (!trigger) {
      setParticles([])
      return
    }

    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2
      const velocity = Math.random() * 10 + 5
      return {
        id: i,
        x,
        y,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        delay: 0,
        size: Math.random() * 6 + 3,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity,
        spin: (Math.random() - 0.5) * 720,
      }
    })

    setParticles(newParticles)

    const timer = setTimeout(() => setParticles([]), duration)
    return () => clearTimeout(timer)
  }, [trigger, x, y, particleCount, duration])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            '--dx': `${particle.velocityX * 20}px`,
            '--dy': `${particle.velocityY * 20}px`,
            animation: `burstOut ${duration}ms ease-out forwards`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export default Confetti

