/**
 * Redirect utility functions for the application
 */

export interface RedirectOptions {
  /** Destination URL (relative or absolute same-origin) */
  to: string
  /** Custom message to display */
  message?: string
  /** Delay in milliseconds before redirect (default: 3000) */
  delay?: number
  /** Whether to auto-redirect (default: true) */
  auto?: boolean
}

/**
 * Create a redirect URL with parameters
 */
export function createRedirectUrl(options: RedirectOptions): string {
  const params = new URLSearchParams()
  
  params.set('to', options.to)
  
  if (options.message) {
    params.set('message', options.message)
  }
  
  if (options.delay !== undefined) {
    params.set('delay', options.delay.toString())
  }
  
  if (options.auto === false) {
    params.set('auto', 'false')
  }
  
  return `/redirect?${params.toString()}`
}

/**
 * Common redirect scenarios
 */
export const redirectScenarios = {
  /** Redirect to login after logout */
  afterLogout: (message = 'You have been logged out successfully') => 
    createRedirectUrl({ to: '/login', message, delay: 2000 }),
  
  /** Redirect to dashboard after login */
  afterLogin: (message = 'Login successful! Welcome back') => 
    createRedirectUrl({ to: '/dashboard', message, delay: 1500 }),
  
  /** Redirect to admin panel after admin login */
  afterAdminLogin: (message = 'Admin login successful') => 
    createRedirectUrl({ to: '/admin/hub', message, delay: 1500 }),
  
  /** Redirect to CMS after admin/cms login */
  afterCmsLogin: (message = 'CMS login successful') => 
    createRedirectUrl({ to: '/cms', message, delay: 1500 }),
  
  /** Redirect after course enrollment */
  afterEnrollment: (courseSlug: string, message = 'Enrollment successful!') => 
    createRedirectUrl({ to: `/courses/${courseSlug}`, message, delay: 2000 }),
  
  /** Redirect after payment */
  afterPayment: (destination: string, message = 'Payment successful!') => 
    createRedirectUrl({ to: destination, message, delay: 2000 }),
  
  /** Redirect to home with custom message */
  toHome: (message = 'Redirecting to home page') => 
    createRedirectUrl({ to: '/', message, delay: 2000 }),
  
  /** Redirect with no auto-redirect (manual only) */
  manual: (to: string, message?: string) => 
    createRedirectUrl({ to, message, auto: false }),
  
  /** Quick redirect (1 second) */
  quick: (to: string, message?: string) => 
    createRedirectUrl({ to, message, delay: 1000 }),
  
  /** Slow redirect (5 seconds) */
  slow: (to: string, message?: string) => 
    createRedirectUrl({ to, message, delay: 5000 })
}

/**
 * Validate if a URL is safe for redirect
 */
export function isValidRedirectUrl(url: string, origin?: string): boolean {
  try {
    // Allow relative URLs
    if (url.startsWith('/')) return true
    
    // Check if it's same origin
    const urlObj = new URL(url, origin || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'))
    const currentOrigin = origin || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    
    return urlObj.origin === currentOrigin
  } catch {
    return false
  }
}

/**
 * Browser-side redirect with validation
 */
export function safeRedirect(url: string): void {
  if (typeof window === 'undefined') return
  
  if (isValidRedirectUrl(url)) {
    window.location.href = url
  } else {
    console.warn('Invalid redirect URL:', url)
    window.location.href = '/'
  }
}

/**
 * Next.js router redirect with validation
 */
export function safePush(router: any, url: string): void {
  if (isValidRedirectUrl(url)) {
    router.push(url)
  } else {
    console.warn('Invalid redirect URL:', url)
    router.push('/')
  }
}