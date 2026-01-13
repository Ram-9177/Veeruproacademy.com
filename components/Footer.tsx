import { Github, Twitter } from 'lucide-react'

const cols = [
	{
		heading: 'Product',
		links: [
			{ href: '/courses', label: 'Courses' },
			{ href: '/projects', label: 'Projects' },
			{ href: '/sandbox', label: 'Sandbox' },
		],
	},
	{
		heading: 'Company',
		links: [
			{ href: '/admin-help', label: 'Admin Help' },
			{ href: 'mailto:admin@veerupro.example', label: 'Contact' },
		],
	},
	{
		heading: 'Resources',
		links: [
			{ href: '/tutorials', label: 'Tutorials' },
			{ href: '/design-system', label: 'Design System' },
		],
	},
]

export default function Footer() {
	return (
		<footer role="contentinfo" className="mt-24 bg-background border-t border-border">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand Column */}
					<div className="lg:col-span-1">
						<p className="text-2xl font-bold text-foreground mb-4">
							Veeru&apos;s Pro Academy
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
							Learn fast, ship confident projects, unlock the sandbox. Your journey to
							becoming a skilled developer starts here.
						</p>
						<form
							className="mt-6 flex flex-col gap-3"
							onSubmit={(e) => {
								e.preventDefault()
							}}
							aria-label="Subscribe to newsletter"
						>
							<input
								type="email"
								required
								placeholder="Enter your email"
								className="flex-1 rounded-lg border border-border bg-input backdrop-blur px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-muted"
								aria-label="Email address"
							/>
							<button
								type="submit"
								className="rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
							>
								<span className="relative z-10">Subscribe</span>
							</button>
						</form>
					</div>

					{/* Links Columns */}
					{cols.map((c) => (
						<div key={c.heading}>
							<p className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
								{c.heading}
							</p>
							<ul className="space-y-3">
								{c.links.map((l) => (
									<li key={l.href}>
										<a
											href={l.href}
											className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 underline-offset-4 hover:underline hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 inline-block"
										>
											{l.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}

					{/* Social Column */}
					<div>
						<p className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
							Connect
						</p>
						<div className="flex gap-3">
							<a
								href="https://github.com/"
								aria-label="GitHub"
								className="inline-flex items-center justify-center rounded-lg border border-border bg-card backdrop-blur p-3 text-foreground hover:bg-muted hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
							>
								<Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
							</a>
							<a
								href="https://twitter.com/"
								aria-label="Twitter"
								className="inline-flex items-center justify-center rounded-lg border border-border bg-card backdrop-blur p-3 text-foreground hover:bg-muted hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
							>
								<Twitter className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
							</a>
						</div>
					</div>
				</div>
				<div className="mt-12 pt-8 border-t border-border">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-xs text-muted-foreground">
							&copy; {new Date().getFullYear()} Veeru&apos;s Pro Academy. All rights reserved.
						</p>
						<div className="flex items-center gap-6">
							<a href="#" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
								Privacy
							</a>
							<a href="#" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
								Terms
							</a>
							<a href="#" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-y-0.5">
								Cookies
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
