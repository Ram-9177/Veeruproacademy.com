"use client";
import { useEffect, useState } from 'react';

export function FocusModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('focus-mode') === '1';
    if (stored) {
      document.documentElement.classList.add('focus-mode');
      setEnabled(true);
    }
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !enabled;
    setEnabled(next);
    if (next) {
      root.classList.add('focus-mode');
      localStorage.setItem('focus-mode', '1');
    } else {
      root.classList.remove('focus-mode');
      localStorage.removeItem('focus-mode');
    }
  };

  return (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label="Toggle focus mode"
      onClick={toggle}
      className="fixed bottom-4 left-4 z-50 px-3 py-2 rounded-md text-xs font-medium bg-muted/70 backdrop-blur-md border border-border/50 hover:bg-muted/90 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
    >
      {enabled ? 'Exit Focus' : 'Focus Mode'}
    </button>
  );
}
