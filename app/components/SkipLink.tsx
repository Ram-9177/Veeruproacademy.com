'use client'

export function SkipLink() {
  const handleSkipClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleSkipClick}
      className="skip-to-content"
    >
      Skip to main content
    </a>
  )
}