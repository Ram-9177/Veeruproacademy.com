/**
 * Education Theme Style Guide Component
 * 
 * This component showcases all the design system elements
 * Use this as a reference for consistent styling across the platform
 */

export function StyleGuide() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Education Theme Style Guide
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional, attractive, and consistent design system for educational platforms
          </p>
        </div>

        {/* Colors */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Primary */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Primary (Education Blue)</h3>
              <div className="space-y-2">
                <div className="h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-medium">
                  #2563eb
                </div>
                <div className="h-10 bg-primary-500 rounded-lg"></div>
                <div className="h-10 bg-primary-400 rounded-lg"></div>
                <div className="h-10 bg-primary-300 rounded-lg"></div>
                <div className="h-10 bg-primary-200 rounded-lg"></div>
                <div className="h-10 bg-primary-100 rounded-lg"></div>
              </div>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Secondary (Success Green)</h3>
              <div className="space-y-2">
                <div className="h-12 bg-secondary-500 rounded-lg flex items-center justify-center text-white font-medium">
                  #10b981
                </div>
                <div className="h-10 bg-secondary-400 rounded-lg"></div>
                <div className="h-10 bg-secondary-300 rounded-lg"></div>
                <div className="h-10 bg-secondary-200 rounded-lg"></div>
                <div className="h-10 bg-secondary-100 rounded-lg"></div>
                <div className="h-10 bg-secondary-50 rounded-lg"></div>
              </div>
            </div>

            {/* Accent */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Accent (Energy Orange)</h3>
              <div className="space-y-2">
                <div className="h-12 bg-accent-500 rounded-lg flex items-center justify-center text-white font-medium">
                  #f59e0b
                </div>
                <div className="h-10 bg-accent-400 rounded-lg"></div>
                <div className="h-10 bg-accent-300 rounded-lg"></div>
                <div className="h-10 bg-accent-200 rounded-lg"></div>
                <div className="h-10 bg-accent-100 rounded-lg"></div>
                <div className="h-10 bg-accent-50 rounded-lg"></div>
              </div>
            </div>

            {/* Tertiary */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Tertiary (Creative Purple)</h3>
              <div className="space-y-2">
                <div className="h-12 bg-tertiary-600 rounded-lg flex items-center justify-center text-white font-medium">
                  #8b5cf6
                </div>
                <div className="h-10 bg-tertiary-500 rounded-lg"></div>
                <div className="h-10 bg-tertiary-400 rounded-lg"></div>
                <div className="h-10 bg-tertiary-300 rounded-lg"></div>
                <div className="h-10 bg-tertiary-200 rounded-lg"></div>
                <div className="h-10 bg-tertiary-100 rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Typography</h2>
          <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200">
            <div>
              <h1 className="text-5xl font-bold text-slate-800">Heading 1 - 48px Bold</h1>
              <p className="text-sm text-slate-500 mt-2">Used for page titles and hero headlines</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-800">Heading 2 - 36px Bold</h2>
              <p className="text-sm text-slate-500 mt-2">Used for section headers</p>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-slate-800">Heading 3 - 30px Semibold</h3>
              <p className="text-sm text-slate-500 mt-2">Used for subsections</p>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-slate-700">Heading 4 - 24px Semibold</h4>
              <p className="text-sm text-slate-500 mt-2">Used for card titles</p>
            </div>
            <div>
              <p className="text-lg text-slate-600">Body Large - 18px Regular</p>
              <p className="text-sm text-slate-500 mt-2">Used for intro paragraphs and important text</p>
            </div>
            <div>
              <p className="text-base text-slate-600">Body Text - 16px Regular</p>
              <p className="text-sm text-slate-500 mt-2">Used for main content and descriptions</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Small Text - 14px Regular</p>
              <p className="text-xs text-slate-400 mt-2">Used for captions and meta information</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Primary</h3>
              <button className="btn-primary px-6 py-3 rounded-xl font-semibold">
                Primary Button
              </button>
              <p className="text-sm text-slate-500">Main CTAs and important actions</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Secondary</h3>
              <button className="btn-secondary px-6 py-3 rounded-xl font-semibold">
                Secondary Button
              </button>
              <p className="text-sm text-slate-500">Success states and positive actions</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Tertiary</h3>
              <button className="btn-tertiary px-6 py-3 rounded-xl font-semibold">
                Tertiary Button
              </button>
              <p className="text-sm text-slate-500">Highlights and special actions</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Outline</h3>
              <button className="px-6 py-3 rounded-xl font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-all">
                Outline Button
              </button>
              <p className="text-sm text-slate-500">Alternative actions</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Ghost</h3>
              <button className="px-6 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                Ghost Button
              </button>
              <p className="text-sm text-slate-500">Subtle actions</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Disabled</h3>
              <button className="px-6 py-3 rounded-xl font-semibold bg-slate-200 text-slate-400 cursor-not-allowed" disabled>
                Disabled Button
              </button>
              <p className="text-sm text-slate-500">Inactive state</p>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Standard Card</h3>
              <p className="text-slate-600">Clean white background with subtle shadow and border</p>
            </div>

            <div className="feature-card">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Feature Card</h3>
              <p className="text-slate-600">Highlighted card for important features</p>
            </div>

            <div className="course-card overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Course Card</h3>
                <p className="text-slate-600">Card with image header for courses</p>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Badges & Tags</h2>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-100 text-primary-700">
              Primary Badge
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-secondary-100 text-secondary-700">
              Success Badge
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-accent-100 text-accent-700">
              Warning Badge
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-error-100 text-error-700">
              Error Badge
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
              Neutral Badge
            </span>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Form Inputs</h2>
          <div className="max-w-2xl space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Text Input</label>
              <input 
                type="text" 
                placeholder="Enter your text here"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Textarea</label>
              <textarea 
                placeholder="Enter your message"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select</label>
              <select className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 outline-none transition-all">
                <option>Choose an option</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="checkbox"
                className="w-5 h-5 rounded border-2 border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
              />
              <label htmlFor="checkbox" className="text-slate-700">Checkbox option</label>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="radio" 
                id="radio"
                name="radio"
                className="w-5 h-5 border-2 border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-200"
              />
              <label htmlFor="radio" className="text-slate-700">Radio option</label>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Spacing System</h2>
          <div className="space-y-4 bg-white p-8 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-1 h-1 bg-primary-600"></div>
              <span className="text-slate-600">xs: 4px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-primary-600"></div>
              <span className="text-slate-600">sm: 8px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-primary-600"></div>
              <span className="text-slate-600">md: 16px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-primary-600"></div>
              <span className="text-slate-600">lg: 24px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary-600"></div>
              <span className="text-slate-600">xl: 32px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600"></div>
              <span className="text-slate-600">2xl: 48px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-600"></div>
              <span className="text-slate-600">3xl: 64px</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
