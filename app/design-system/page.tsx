// Server Component: keep this page static for performance and to avoid RSC payload issues

export default function DesignSystemPage() {
  return (
    <>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-32 px-4 bg-[hsl(var(--neutral))] text-[hsl(var(--neutral-foreground))] border-b border-[hsl(var(--neutral-border))]">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-7xl font-bold mb-6">Design System</h1>
            <p className="text-2xl text-[hsl(var(--secondary-1))] font-semibold">Professional, clean, light-first foundation</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 px-4 bg-[hsl(var(--neutral))] text-[hsl(var(--neutral-foreground))] border-b border-[hsl(var(--neutral-border))]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold mb-16 text-center">Design System Metrics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 rounded-2xl bg-white border border-[hsl(var(--neutral-border))] shadow-sm">
                <div className="text-5xl font-bold mb-2">12+</div>
                <p className="text-lg text-[hsl(var(--secondary-1))]">Color Themes</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-white border border-[hsl(var(--neutral-border))] shadow-sm">
                <div className="text-5xl font-bold mb-2">7</div>
                <p className="text-lg text-[hsl(var(--secondary-1))]">Button Variants</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-white border border-[hsl(var(--neutral-border))] shadow-sm">
                <div className="text-5xl font-bold mb-2">100%</div>
                <p className="text-lg text-[hsl(var(--secondary-1))]">WCAG AA</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-white border border-[hsl(var(--neutral-border))] shadow-sm">
                <div className="text-5xl font-bold mb-2">∞</div>
                <p className="text-lg text-[hsl(var(--secondary-1))]">Combinations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Surface Variants Showcase */}
        <section className="py-24 px-4 bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold mb-4">Surface Variants</h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Different white box treatments for pricing, cards, and feature sections. They stand out on a pure white background while keeping the clean aesthetic.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="surface-base p-6">
                <h3 className="text-xl font-semibold mb-2">Base</h3>
                <p className="text-sm">Plain white with subtle border & shadow for neutral containers.</p>
              </div>
              <div className="surface-subtle-indigo p-6">
                <h3 className="text-xl font-semibold mb-2">Subtle Indigo</h3>
                <p className="text-sm">Tinted background with indigo border for gentle emphasis.</p>
              </div>
              <div className="surface-tinted-emerald p-6">
                <h3 className="text-xl font-semibold mb-2">Tinted Emerald</h3>
                <p className="text-sm">Stronger tint variant with semantic success accent.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="surface-elevated p-6">
                <h3 className="text-xl font-semibold mb-2">Elevated</h3>
                <p className="text-sm">Higher elevation for modal-like or highlight sections.</p>
              </div>
              <div className="surface-glow-indigo p-6">
                <h3 className="text-xl font-semibold mb-2">Glow Indigo</h3>
                <p className="text-sm">Glow ring for premium or primary emphasis states.</p>
              </div>
              <div className="surface-gradient-ring">
                <div className="inner">
                  <h3 className="text-xl font-semibold mb-2">Gradient Ring</h3>
                  <p className="text-sm">Multi-accent gradient border frame for marketing hero blocks.</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="surface-accent-bar surface-accent-bar-navy p-6">
                <h3 className="text-xl font-semibold mb-2">Accent Bar Navy</h3>
                <p className="text-sm">Vertical gradient bar for list groups or feature highlight.</p>
              </div>
              <div className="surface-accent-bar surface-accent-bar-emerald p-6">
                <h3 className="text-xl font-semibold mb-2">Accent Bar Emerald</h3>
                <p className="text-sm">Alternative success accent variant for onboarding steps.</p>
              </div>
              <div className="surface-accent-bar surface-accent-bar-rose p-6">
                <h3 className="text-xl font-semibold mb-2">Accent Bar Rose</h3>
                <p className="text-sm">Creative highlight variant for design or UI sections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-24 px-4 bg-white/90 backdrop-blur-sm border-t border-white/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold mb-4">Pricing Tiers</h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">Attractive white cards with differentiation through subtle tint, glow, and gradient badge accents.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="pricing-tier pricing-tier--starter">
                <span className="pricing-badge">Starter</span>
                <div>
                  <div className="pricing-price mb-1">₹0</div>
                  <div className="pricing-period">Forever free</div>
                </div>
                <div className="space-y-3">
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Access to basic lessons</span></div>
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Sandbox limited usage</span></div>
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Community access</span></div>
                </div>
                <button className="pricing-cta">Get Started</button>
              </div>
              {/* Pro */}
              <div className="pricing-tier pricing-tier--pro">
                <span className="pricing-badge pricing-badge-emerald">Pro</span>
                <div>
                  <div className="pricing-price mb-1">₹799</div>
                  <div className="pricing-period">Per project / asset pack</div>
                </div>
                <div className="space-y-3">
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Premium project templates</span></div>
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Advanced sandbox unlocks</span></div>
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Drive asset delivery</span></div>
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Priority support</span></div>
                </div>
                <button className="pricing-cta">Purchase</button>
              </div>
              {/* Enterprise */}
              <div className="pricing-tier pricing-tier--enterprise">
                <span className="pricing-badge pricing-badge-navy">Enterprise</span>
                <div>
                  <div className="pricing-price mb-1">Custom</div>
                  <div className="pricing-period">Bulk licensing & teams</div>
                </div>
                <div className="space-y-3">
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Team training modules</span></div>
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Custom asset bundling</span></div>
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Dedicated account manager</span></div>
                  <div className="pricing-feature"><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Private sandbox instances</span></div>
                </div>
                <button className="pricing-cta">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
