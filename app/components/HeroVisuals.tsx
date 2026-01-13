export function HeroVisuals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Spectacular Holographic Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/30 to-secondary-1/20 blur-3xl animate-pulse opacity-70" 
           style={{ animationDuration: '6s' }} />
      
      <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-secondary-2/25 to-secondary-3/15 blur-3xl animate-pulse opacity-60" 
           style={{ animationDuration: '8s', animationDelay: '2s' }} />

      <div className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-secondary-1/20 to-primary/15 blur-3xl animate-pulse opacity-50" 
           style={{ animationDuration: '10s', animationDelay: '4s' }} />

      {/* Floating Holographic Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full animate-bounce opacity-60 ${
              i % 4 === 0 ? 'bg-gradient-to-r from-primary to-secondary-1' :
              i % 4 === 1 ? 'bg-gradient-to-r from-secondary-1 to-secondary-2' :
              i % 4 === 2 ? 'bg-gradient-to-r from-secondary-2 to-secondary-3' :
              'bg-gradient-to-r from-secondary-3 to-primary'
            }`}
            style={{
              top: `${15 + (i * 7)}%`,
              left: `${10 + (i * 8)}%`,
              animationDuration: `${3 + (i * 0.5)}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Spectacular Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)] opacity-30" />

      {/* Holographic Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-20" 
           style={{ animationDuration: '4s' }} />

      {/* Premium Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)] opacity-30" />
    </div>
  )
}
