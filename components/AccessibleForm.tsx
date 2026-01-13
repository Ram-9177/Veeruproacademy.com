/**
 * Accessible Form Component Example
 * 
 * Demonstrates best practices for accessible form fields:
 * - Proper label-input association
 * - Error announcements
 * - Required field indication
 * - Focus management
 * - ARIA attributes
 */

import React, { useId } from 'react'
import { 
  getRequiredFieldIndicator,
  announceValidationError 
} from '@/lib/accessibility'

interface AccessibleInputProps {
  label: string
  id?: string
  name: string
  type?: string
  value: string
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  description?: string
  'aria-describedby'?: string
}

/**
 * Accessible Input Field
 * Properly associates label with input, announces errors
 */
export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  id: providedId,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  description,
  ...props
}) => {
  const id = useId()
  const inputId = providedId || id
  const errorId = error ? `${inputId}-error` : undefined
  const descriptionId = description ? `${inputId}-description` : undefined
  const ariaDescribedBy = [errorId, descriptionId, props['aria-describedby']]
    .filter(Boolean)
    .join(' ')

  // Announce error to screen readers
  React.useEffect(() => {
    if (error) {
      announceValidationError(label, error)
    }
  }, [error, label])

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block font-medium text-slate-900">
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-slate-600">
          {description}
        </p>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        {...(required ? getRequiredFieldIndicator() : {})}
        aria-describedby={ariaDescribedBy || undefined}
        aria-invalid={!!error}
        className={`w-full px-4 py-2 border rounded-lg font-normal transition-colors ${
          error 
            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
            : 'border-slate-300 focus:ring-primary'
        } focus:outline-none focus:ring-2`}
      />

      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="assertive"
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </div>
      )}
    </div>
  )
}

interface AccessibleSelectProps {
  label: string
  id?: string
  name: string
  value: string
  onChange: (_e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  error?: string
  required?: boolean
  disabled?: boolean
  description?: string
}

/**
 * Accessible Select Field
 * Proper ARIA for dropdown selections
 */
export const AccessibleSelect: React.FC<AccessibleSelectProps> = ({
  label,
  id: providedId,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  description,
}) => {
  const id = useId()
  const selectId = providedId || id
  const errorId = error ? `${selectId}-error` : undefined
  const descriptionId = description ? `${selectId}-description` : undefined
  const ariaDescribedBy = [errorId, descriptionId]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="block font-medium text-slate-900">
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-slate-600">
          {description}
        </p>
      )}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...(required ? getRequiredFieldIndicator() : {})}
        aria-describedby={ariaDescribedBy || undefined}
        aria-invalid={!!error}
        className={`w-full px-4 py-2 border rounded-lg font-normal transition-colors ${
          error 
            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
            : 'border-slate-300 focus:ring-primary'
        } focus:outline-none focus:ring-2`}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="assertive"
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </div>
      )}
    </div>
  )
}

interface AccessibleCheckboxProps {
  id?: string
  name: string
  label: string
  checked: boolean
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  disabled?: boolean
}

/**
 * Accessible Checkbox
 * Proper label association and ARIA
 */
export const AccessibleCheckbox: React.FC<AccessibleCheckboxProps> = ({
  id: providedId,
  name,
  label,
  checked,
  onChange,
  description,
  disabled = false,
}) => {
  const id = useId()
  const checkboxId = providedId || id
  const descriptionId = description ? `${checkboxId}-description` : undefined

  return (
    <div className="flex items-start gap-3">
      <input
        id={checkboxId}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-describedby={descriptionId}
        className="mt-1 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary"
      />
      <label htmlFor={checkboxId} className="flex flex-col gap-1 cursor-pointer">
        <span className="font-medium text-slate-900">{label}</span>
        {description && (
          <span id={descriptionId} className="text-sm text-slate-600">
            {description}
          </span>
        )}
      </label>
    </div>
  )
}

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isIconOnly?: boolean
  ariaLabel?: string
}

/**
 * Accessible Button
 * Proper disabled state, loading indication, and aria-labels
 */
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  isIconOnly = false,
  ariaLabel,
  disabled = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-label={isIconOnly ? (ariaLabel || 'Button') : undefined}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading && (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          role="status"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
