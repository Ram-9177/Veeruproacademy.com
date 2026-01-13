'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/app/components/Badge'
import { Button } from '@/app/components/Button'
import { Section } from '@/app/components/Section'
import { PageHero } from '@/app/components/PageHero'
import { cn } from '@/lib/utils'
import { Code2, Play, Grid } from 'lucide-react'
import { RealtimeSandbox } from '@/app/components/RealtimeSandbox'
import { useSearchParams } from 'next/navigation'

const snippets = [
  {
    title: 'Animated CTA',
    description: 'Rounded call-to-action button with pulse hover.',
    html: '<button class="cta">Launch project</button>',
    css: `body { 
  font-family: 'Inter', system-ui; 
  background: #0f172a; 
  color: #e2e8f0; 
  margin: 0; 
  padding: 24px;
}
.cta { 
  padding: 16px 24px; 
  border-radius: 16px; 
  background: linear-gradient(120deg, #667eea, #764ba2); 
  color: #ffffff; 
  font-weight: 800; 
  letter-spacing: -0.01em; 
  border: none; 
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3); 
  transition: 0.2s transform; 
  cursor: pointer;
}
.cta:hover { 
  transform: translateY(-4px) scale(1.01); 
}`,
    js: `console.log('CTA button loaded!');

document.querySelector('.cta').addEventListener('click', function() {
  this.style.background = 'linear-gradient(120deg, #f093fb, #f5576c)';
  console.log('Button clicked!');
});`
  },
  {
    title: 'Card Grid',
    description: 'Responsive grid with hover lift and gradient border.',
    html: `<div class="grid">
  <div class="card">
    <div class="title">Dashboard Shell</div>
    <div class="desc">Navigation, header bar, and charts with motion-ready mounts.</div>
  </div>
  <div class="card">
    <div class="title">AI Support Kit</div>
    <div class="desc">Chat UI with quick replies, tags, and transcript export.</div>
  </div>
  <div class="card">
    <div class="title">Analytics Hub</div>
    <div class="desc">Real-time metrics with beautiful visualizations.</div>
  </div>
</div>`,
    css: `* { 
  box-sizing: border-box; 
}
body { 
  background: #0f172a; 
  color: #e2e8f0; 
  font-family: 'Inter', system-ui; 
  padding: 24px; 
  margin: 0;
}
.grid { 
  display: grid; 
  gap: 16px; 
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
}
.card { 
  position: relative; 
  padding: 20px; 
  border-radius: 18px; 
  background: #0b1225; 
  overflow: hidden; 
  border: 1px solid rgba(255,255,255,.06); 
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  border-color: rgba(102, 126, 234, 0.3);
}
.card::before { 
  content:''; 
  position:absolute; 
  inset:-1px; 
  border-radius: inherit; 
  padding:1px; 
  background: linear-gradient(120deg, #667eea, #764ba2); 
  -webkit-mask: linear-gradient(#000,#000) content-box, linear-gradient(#000,#000); 
  -webkit-mask-composite: xor; 
  mask-composite: exclude; 
  opacity: 0;
  transition: opacity 0.3s ease;
}
.card:hover::before {
  opacity: 1;
}
.title { 
  font-weight:700; 
  letter-spacing:-0.01em; 
  margin-bottom:8px;
  color: #ffffff;
}
.desc { 
  color:#94a3b8; 
  font-size:14px; 
  line-height:1.5; 
}`,
    js: `console.log('Card grid loaded!');

// Add click animations
document.querySelectorAll('.card').forEach((card, index) => {
  card.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'translateY(-8px)';
    }, 150);
    console.log(\`Card \${index + 1} clicked!\`);
  });
});`
  },
  {
    title: 'Pricing Layout',
    description: 'Two-column pricing with badges and accent CTA.',
    html: `<div class="pricing">
  <div class="plan">
    <span class="badge">Starter</span>
    <div class="price">Free</div>
    <div class="features">Lesson access • Editor • Deploy to preview</div>
    <button class="cta">Start now</button>
  </div>
  <div class="plan featured">
    <span class="badge">Pro</span>
    <div class="price">₹799</div>
    <div class="features">Assets • Reviews • AI snippets • Drive exports</div>
    <button class="cta">Unlock Pro</button>
  </div>
</div>`,
    css: `body { 
  margin:0; 
  padding:32px; 
  background:#0f172a; 
  color:#e2e8f0; 
  font-family: 'Inter', system-ui; 
}
.pricing { 
  display:grid; 
  grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); 
  gap:20px; 
}
.plan { 
  border-radius:20px; 
  padding:24px; 
  background:#0b1225; 
  border:1px solid rgba(255,255,255,.08); 
  transition: all 0.3s ease;
  position: relative;
}
.plan:hover {
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.3);
}
.plan.featured {
  border-color: rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #0b1225 0%, rgba(102, 126, 234, 0.1) 100%);
}
.badge { 
  display:inline-block; 
  padding:8px 12px; 
  border-radius:12px; 
  background:rgba(102, 126, 234, 0.2); 
  color:#cbd5ff; 
  font-size:12px; 
  font-weight:700; 
}
.featured .badge {
  background: linear-gradient(120deg, #667eea, #764ba2);
  color: #ffffff;
}
.price { 
  font-size:36px; 
  font-weight:800; 
  color:#fbbf24; 
  margin:12px 0; 
}
.features { 
  color:#a5b4c8; 
  line-height:1.6; 
  font-size:14px; 
  margin-bottom: 16px;
}
.cta { 
  width: 100%;
  padding:14px 20px; 
  border-radius:14px; 
  border:none; 
  background:#667eea; 
  color:#ffffff; 
  font-weight:800; 
  cursor:pointer; 
  transition: all 0.3s ease;
}
.cta:hover {
  background: linear-gradient(120deg, #667eea, #764ba2);
  transform: translateY(-2px);
}`,
    js: `console.log('Pricing layout loaded!');

// Add interactive pricing
document.querySelectorAll('.cta').forEach((button, index) => {
  button.addEventListener('click', function() {
    const plan = this.closest('.plan');
    const planName = plan.querySelector('.badge').textContent;
    
    this.textContent = 'Selected!';
    this.style.background = 'linear-gradient(120deg, #f093fb, #f5576c)';
    
    setTimeout(() => {
      this.textContent = this.textContent.includes('Pro') ? 'Unlock Pro' : 'Start now';
      this.style.background = '#667eea';
    }, 2000);
    
    console.log(\`Selected \${planName} plan!\`);
  });
});`
  }
]

export default function SandboxPage() {
  const searchParams = useSearchParams()
  const exerciseIndex = searchParams?.get('exercise')
  const lessonId = searchParams?.get('lesson')
  
  const [selectedSnippet, setSelectedSnippet] = useState(snippets[0])

  // Load exercise from course content if specified
  useEffect(() => {
    if (exerciseIndex && lessonId) {
      // TODO: Fetch lesson content and exercise from API using lessonId
      // const response = await fetch(\`/api/lessons/\${lessonId}\`)
      // ...
      
      // Placeholder log until API integration
      console.log('Would fetch exercise:', { exerciseIndex, lessonId })
    }
  }, [exerciseIndex, lessonId])

  const handleSave = (code: { html: string; css: string; js: string }) => {
    // Save to localStorage with timestamp
    const saveData = {
      ...code,
      timestamp: new Date().toISOString(),
      snippet: selectedSnippet.title
    }
    
    localStorage.setItem('sandbox-code', JSON.stringify(saveData))
    
    // Show success message
    const button = document.querySelector('[data-save-button]') as HTMLButtonElement
    if (button) {
      const originalText = button.textContent
      button.textContent = 'Saved! ✓'
      button.style.background = '#10b981'
      
      setTimeout(() => {
        button.textContent = originalText
        button.style.background = ''
      }, 2000)
    }
    
    console.log('Code saved successfully:', saveData)
  }

  return (
    <div className="pb-16 min-h-screen">
      <PageHero
        eyebrow="Sandbox"
        title="Practice in the built-in editor"
        description="Premium students unlock the Veeru Sandbox with live preview, snippets from lessons, and manual export to Google Drive."
      >
        <div className="mt-8 flex flex-col gap-8">
          <div className="flex flex-wrap gap-3">
            <Badge tone="neutral" className="bg-background/50 hover:bg-background hover:scale-105 transition-transform duration-200 cursor-pointer border-border">
              <span className="mr-1">🚀</span>No setup
            </Badge>
            <Badge tone="neutral" className="bg-background/50 hover:bg-background hover:scale-105 transition-transform duration-200 cursor-pointer border-border">
              <span className="mr-1">💾</span>Autosave
            </Badge>
            <Badge tone="neutral" className="bg-background/50 hover:bg-background hover:scale-105 transition-transform duration-200 cursor-pointer border-border">
              <span className="mr-1">👀</span>Split preview
            </Badge>
            <Badge tone="secondary-1" className="hover:scale-105 transition-transform duration-200 cursor-pointer animate-pulse">
              <span className="mr-1">🔥</span>Live reload
            </Badge>
          </div>
          
          {/* Fun stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 glass-card rounded-xl hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-xs text-muted-foreground font-medium">Code snippets</div>
            </div>
            <div className="text-center p-4 glass-card rounded-xl hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-foreground">0ms</div>
              <div className="text-xs text-muted-foreground font-medium">Setup time</div>
            </div>
            <div className="text-center p-4 glass-card rounded-xl hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-accent">100%</div>
              <div className="text-xs text-muted-foreground font-medium">Browser-based</div>
            </div>
            <div className="text-center p-4 glass-card rounded-xl hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-destructive">∞</div>
              <div className="text-xs text-muted-foreground font-medium">Possibilities</div>
            </div>
          </div>
        </div>
      </PageHero>

      <Section className="py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[280px,1fr] xl:grid-cols-[320px,1fr]">
          {/* Snippets Sidebar */}
          <div className="glass-card rounded-2xl p-4 h-fit">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Grid className="h-4 w-4 text-primary" />
              </div>
              <span>Code Templates</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Live</span>
              </div>
            </div>
            <div className="space-y-3">
              {snippets.map((snippet, index) => (
                <button
                  key={snippet.title}
                  onClick={() => setSelectedSnippet(snippet)}
                  className={cn(
                    'w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 group relative overflow-hidden',
                    selectedSnippet.title === snippet.title
                      ? 'border-primary/50 bg-primary/10 text-primary shadow-sm transform scale-105'
                      : 'border-border bg-card/50 text-foreground hover:border-primary/30 hover:bg-primary/5 hover:scale-102'
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full" />
                  
                  <div className="relative flex items-start gap-3">
                    <div className="text-lg mt-0.5">
                      {index === 0 && '🎨'}
                      {index === 1 && '📱'}
                      {index === 2 && '💰'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{snippet.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{snippet.description}</div>
                    </div>
                    {selectedSnippet.title === snippet.title && (
                      <div className="text-primary animate-pulse">
                        <Play className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Quick tips */}
            <div className="mt-6 p-3 bg-secondary/50 rounded-lg border border-border">
              <div className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
                <span>💡</span>
                Quick tip
              </div>
              <p className="text-xs text-muted-foreground">
                Try modifying the code in the editor to see live changes in the preview!
              </p>
            </div>
          </div>

          {/* Sandbox Editor */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Code2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{selectedSnippet.title}</div>
                  <div className="text-xs text-muted-foreground">Real-time editor</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  size="sm" 
                  onClick={() => setSelectedSnippet(selectedSnippet)} 
                  icon={<Play className="h-4 w-4" />}
                  className="hover:scale-105 transition-transform duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Reset
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleSave({ html: '', css: '', js: '' })} 
                  className="hover:scale-105 transition-transform duration-200 bg-green-600 text-white hover:bg-green-700"
                  data-save-button
                >
                  Save Code
                </Button>
              </div>
            </div>
            
            <div className="h-[600px]">
              <RealtimeSandbox
                key={selectedSnippet.title}
                initialHtml={selectedSnippet.html}
                initialCss={selectedSnippet.css}
                initialJs={selectedSnippet.js}
                onSave={handleSave}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
