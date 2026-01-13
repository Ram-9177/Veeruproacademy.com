/**
 * Accessibility Utilities
 * 
 * Helpers for implementing WCAG 2.1 AA accessibility standards.
 * Ensures forms, interactive elements, and dynamic content are accessible.
 */

/**
 * Generate a unique ID for form controls and labels
 * Useful for associating labels with inputs
 */
export function generateFormId(baseName: string): string {
  return `${baseName}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Announce text changes to screen readers
 * Useful for form validation errors, loading states, etc.
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  // Create or get the announcement element
  let announcement = document.getElementById('sr-announcement')
  
  if (!announcement) {
    announcement = document.createElement('div')
    announcement.id = 'sr-announcement'
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'  // Visually hidden
    document.body.appendChild(announcement)
  }

  announcement.setAttribute('aria-live', priority)
  announcement.textContent = message

  // Clear after announcement is read (typically 3 seconds)
  setTimeout(() => {
    announcement!.textContent = ''
  }, 3000)
}

/**
 * Keyboard navigation helper
 * Handle Escape key for closing modals/dropdowns
 */
export function handleEscapeKey(callback: () => void): (_event: KeyboardEvent) => void {
  return (_event: KeyboardEvent) => {
    if (_event.key === 'Escape' || _event.keyCode === 27) {
      callback()
    }
  }
}

/**
 * Focus trap helper
 * Keep focus within a modal or dialog
 */
export function createFocusTrap(container: HTMLElement) {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  return {
    handleKeyDown: (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }
  }
}

/**
 * Check if element is in viewport
 * Useful for announcing dynamic content that enters viewport
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Skip link helper
 * Creates skip to main content links for keyboard navigation
 */
export function createSkipLink(targetSelector: string): HTMLAnchorElement {
  const link = document.createElement('a')
  link.href = `#${targetSelector}`
  link.textContent = 'Skip to main content'
  link.className = 'sr-only focus:not-sr-only'
  link.setAttribute('aria-label', 'Skip to main content')
  return link
}

/**
 * Form validation announcement
 * Announce validation errors to screen readers
 */
export function announceValidationError(fieldName: string, error: string) {
  announceToScreenReader(`${fieldName}: ${error}`, 'assertive')
}

/**
 * Collapse/expand announcement
 * Announce when collapsible sections open or close
 */
export function announceToggleState(label: string, isExpanded: boolean) {
  const state = isExpanded ? 'expanded' : 'collapsed'
  announceToScreenReader(`${label} ${state}`, 'polite')
}

/**
 * Loading state announcement
 * Announce when async operations start/complete
 */
export function announceLoadingState(action: string, isLoading: boolean) {
  if (isLoading) {
    announceToScreenReader(`Loading ${action}...`, 'polite')
  } else {
    announceToScreenReader(`${action} complete`, 'polite')
  }
}

/**
 * Tooltip accessibility
 * Generate proper ARIA attributes for tooltips
 */
export function getTooltipAttributes(tooltipText: string) {
  return {
    'aria-label': tooltipText,
    'title': tooltipText,
    'role': 'tooltip'
  }
}

/**
 * Button loading state
 * Disable button and announce loading state
 */
export function getLoadingButtonAttributes(isLoading: boolean, label: string) {
  return {
    disabled: isLoading,
    'aria-busy': isLoading,
    'aria-label': isLoading ? `Loading ${label}...` : label
  }
}

/**
 * Error message announcement
 * Announce errors for form submission
 */
export function getErrorMessageAttributes(fieldName: string) {
  const errorId = `error-${fieldName}`
  return {
    id: errorId,
    role: 'alert',
    'aria-live': 'assertive'
  }
}

/**
 * Link attributes
 * Ensure links have proper aria-labels for icon-only links
 */
export function getLinkAttributes(text: string, isIconOnly: boolean = false) {
  return isIconOnly ? {
    'aria-label': text,
    title: text
  } : {}
}

/**
 * Required field indicator
 * Mark required form fields accessibly
 */
export function getRequiredFieldIndicator() {
  return {
    'aria-required': true,
    'required': true
  }
}

/**
 * Page title for screen readers
 * Announce major page transitions
 */
export function announcePageTitle(title: string) {
  announceToScreenReader(`Page: ${title}`, 'assertive')
}

/**
 * Modal role and attributes
 * Proper ARIA for modal dialogs
 */
export function getModalAttributes(_title: string) {
  return {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modal-title',
    'aria-describedby': 'modal-description'
  }
}

/**
 * Image alt text guidelines
 * Helper to ensure meaningful alt text
 */
export function getImageAttributes(alt: string, isDecorative: boolean = false) {
  return isDecorative ? {
    alt: '',
    'aria-hidden': 'true'
  } : {
    alt
  }
}

/**
 * List item structure
 * Proper ARIA for complex list items
 */
export function getListItemAttributes(isInteractive: boolean = false) {
  return isInteractive ? {
    role: 'button',
    tabIndex: 0
  } : {}
}
