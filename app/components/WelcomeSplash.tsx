'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

interface WelcomeSplashProps {
  onComplete?: () => void
}

export function WelcomeSplash({ onComplete }: WelcomeSplashProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setIsExiting(true)
      // Complete the animation after fade out
      setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 600) // Match animation duration
    }, 2000) // 2 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden',
        'bg-background text-foreground',
        isExiting ? 'animate-fade-out' : 'animate-fade-in'
      )}
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(16,185,129,0.18),transparent_30%)]" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br from-cyan-400/30 to-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-emerald-400/30 to-teal-500/20 rounded-full blur-3xl animate-blob-delayed" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6">
        <div className={cn(
          'grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center rounded-3xl bg-card/50 backdrop-blur-xl border border-border shadow-2xl shadow-primary/10 p-10 md:p-14 transition-all duration-1000',
          isExiting ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        )}>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-sm font-semibold text-foreground/90 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Launching your workspace
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">Welcome to</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent">
                  {siteConfig.name}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                {siteConfig.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Ready tracks', value: '18' },
                { label: 'Active learners', value: '6,500+' },
                { label: 'Avg. start time', value: '2.4s' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-card/50 px-4 py-3 text-foreground/90">
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-gradient-to-br from-card/80 via-card/60 to-card/60 p-6 shadow-inner shadow-black/30">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Preparing modules</span>
              <span>82%</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-foreground/10">
              <div className="absolute inset-y-0 left-0 w-[82%] rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/70 animate-pulse-slow" />
            </div>
            <div className="grid gap-3 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Syncing lessons and labs
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.15s' }} />
                Warming up sandbox environments
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                Loading your dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes blob-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 50px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-in-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 0.6s ease-in-out forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-blob-delayed {
          animation: blob-delayed 7s infinite;
          animation-delay: 2s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
