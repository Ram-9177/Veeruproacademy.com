'use client';

import React, { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import Image from 'next/image';

/* ========== TYPE DEFINITIONS ========== */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'elevated';
  className?: string;
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'beginner' | 'intermediate' | 'advanced';
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  closeButton?: boolean;
}

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
  icon?: ReactNode;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/* ========== BUTTON COMPONENT ========== */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/15 rounded-md';
  
  const variantClasses = {
    primary: 'bg-[linear-gradient(135deg,#2563EB,#0EA5E9)] text-white hover:brightness-95 shadow-sm hover:shadow-md',
    secondary: 'border border-[#CBD5F5] text-[hsl(var(--neutral-foreground))] bg-white hover:bg-[#EEF2FF]',
    ghost: 'hover:bg-[hsl(var(--neutral-subtle))] text-[hsl(var(--neutral-foreground))]',
    icon: 'p-2 hover:bg-[hsl(var(--neutral-subtle))] text-[hsl(var(--neutral-foreground))] rounded-full',
    outline: 'border border-[hsl(var(--neutral-border))] bg-white text-[hsl(var(--neutral-foreground))] hover:bg-[hsl(var(--neutral-subtle))]',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${size === 'sm' ? sizeClasses.sm : size === 'lg' ? sizeClasses.lg : sizeClasses.md} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block animate-spin">⟳</span>
      ) : (
        icon
      )
      }
      {children}
    </button>
  );
};

/* ========== INPUT COMPONENT ========== */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="label text-foreground font-medium text-sm">
          {label}
        </label>
      )}
      <input
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-destructive focus-visible:ring-destructive' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
};

/* ========== TEXTAREA COMPONENT ========== */
export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="label text-foreground font-medium text-sm">
          {label}
        </label>
      )}
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-destructive focus-visible:ring-destructive' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
};

/* ========== SELECT COMPONENT ========== */
export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="label text-foreground font-medium text-sm">
          {label}
        </label>
      )}
      <select
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-destructive focus:ring-destructive' : ''} ${className}`}
        {...props}
      >
        <option value="">Select an option...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
};

/* ========== CARD COMPONENT ========== */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
    hover: 'rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1',
    elevated: 'rounded-xl border border-border bg-card text-card-foreground shadow-lg',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

/* ========== BADGE COMPONENT ========== */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
}) => {
  const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    success: 'border-transparent bg-emerald-500/15 text-emerald-700',
    warning: 'border-transparent bg-amber-500/15 text-amber-700',
    error: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    info: 'border-transparent bg-blue-500/15 text-blue-700',
    beginner: 'border-transparent bg-secondary text-secondary-foreground',
    intermediate: 'border-transparent bg-blue-500/15 text-blue-700',
    advanced: 'border-transparent bg-purple-500/15 text-purple-700',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant]} ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

/* ========== PROGRESS COMPONENT ========== */
export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = true,
  label = 'Progress',
  variant = 'default',
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-destructive',
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs font-medium text-muted-foreground">{percentage}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full w-full flex-1 transition-all ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

/* ========== PILL COMPONENT ========== */
export const Pill: React.FC<PillProps> = ({
  children,
  active = false,
  icon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${active ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'} ${className}`}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
};

/* ========== MODAL COMPONENT ========== */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold leading-none tracking-tight text-foreground">
            {title}
          </h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{children}</div>
        {footer && <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{footer}</div>}
      </div>
    </>
  );
};

/* ========== TOOLTIP COMPONENT ========== */
interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={`absolute hidden group-hover:block ${positionClasses[position]} z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 whitespace-nowrap`}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
};

/* ========== ALERT COMPONENT ========== */
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  const variantClasses = {
    info: 'border-blue-500/50 text-blue-700 bg-blue-500/10',
    success: 'border-emerald-500/50 text-emerald-700 bg-emerald-500/10',
    warning: 'border-amber-500/50 text-amber-700 bg-amber-500/10',
    error: 'border-destructive/50 text-destructive bg-destructive/10',
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variantClasses[variant]}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm [&_p]:leading-relaxed">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="text-xl leading-none opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

/* ========== SPINNER COMPONENT ========== */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    primary: 'border-primary border-t-transparent',
    secondary: 'border-muted-foreground border-t-transparent',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${variantClasses[variant]} border-4 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

/* ========== TABS COMPONENT ========== */
interface Tab {
  label: string;
  id: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  return (
    <div className="space-y-4">
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50 hover:text-foreground'
            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

/* ========== DIVIDER COMPONENT ========== */
interface DividerProps {
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'horizontal',
  className = '',
}) => {
  return (
    <div
      className={`${variant === 'horizontal' ? 'w-full h-px' : 'h-full w-px'} bg-border ${className}`}
    />
  );
};

/* ========== AVATAR COMPONENT ========== */
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  initials,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border border-border`}
        width={64} // Adjust width based on size
        height={64} // Adjust height based on size
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold border border-border`}
    >
      {initials}
    </div>
  );
};
