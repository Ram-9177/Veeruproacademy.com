export const EXTENSION_ERROR_PATTERNS = [
  'chrome-extension://oihbmmeelledioenpfcfehdjhdnlfibj',
  'moz-extension://'
]

export const REACT_INVARIANT_MARKER = 'reactjs.org/docs/error-decoder.html?invariant='

export const extensionGuardInlineScript = `(() => {
  try {
    if (typeof window === 'undefined' || window.__extensionErrorGuarded) {
      return;
    }

    const extensionPatterns = ${JSON.stringify(EXTENSION_ERROR_PATTERNS)};
    const reactInvariantMarker = ${JSON.stringify(REACT_INVARIANT_MARKER)};

    const isExtensionSource = (input) =>
      typeof input === 'string' && extensionPatterns.some((pattern) => input.includes(pattern));

    const isReactInvariant = (input) =>
      typeof input === 'string' && input.includes(reactInvariantMarker);

    const extractReasonString = (reason) => {
      if (typeof reason === 'string') {
        return reason;
      }

      if (reason instanceof Error) {
        return reason.stack ?? reason.message;
      }

      if (reason && typeof reason === 'object') {
        const message = typeof reason.message === 'string' ? reason.message : undefined;
        const stack = typeof reason.stack === 'string' ? reason.stack : undefined;
        return stack ?? message;
      }

      return undefined;
    };

    const isExtensionRelatedError = ({ filename, message, error }) => {
      const candidates = [filename, error?.stack, error?.message];
      const hasExtensionSource = candidates.some((candidate) => typeof candidate === 'string' && isExtensionSource(candidate));

      if (hasExtensionSource) {
        return true;
      }

      return isReactInvariant(message) && candidates.some((candidate) => typeof candidate === 'string' && isExtensionSource(candidate));
    };

    const isExtensionRelatedReason = (reason) => {
      const reasonString = extractReasonString(reason);
      return typeof reasonString === 'string' && isExtensionSource(reasonString);
    };

    const handleError = (event) => {
      if (isExtensionRelatedError(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.warn('Ignored browser extension runtime error:', event.error?.message ?? event.message);
      }
    };

    const handleRejection = (event) => {
      const { reason } = event;
      if (isExtensionRelatedReason(reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.warn('Ignored browser extension promise rejection:', reason);
      }
    };

    window.addEventListener('error', handleError, { capture: true });
    window.addEventListener('unhandledrejection', handleRejection, { capture: true });
    window.__extensionErrorGuarded = true;
  } catch (error) {
    console.warn('Failed to install extension error guard', error);
  }
})();`

export const isExtensionSource = (input?: string | null) =>
  Boolean(input && EXTENSION_ERROR_PATTERNS.some((pattern) => input.includes(pattern)))

export const isReactInvariant = (input?: string | null) =>
  Boolean(input && input.includes(REACT_INVARIANT_MARKER))

export const extractReasonString = (reason: unknown): string | undefined => {
  if (typeof reason === 'string') {
    return reason
  }

  if (reason instanceof Error) {
    return reason.stack ?? reason.message
  }

  if (reason && typeof reason === 'object') {
    const message = 'message' in reason && typeof (reason as { message?: unknown }).message === 'string'
      ? (reason as { message: string }).message
      : undefined

    const stack = 'stack' in reason && typeof (reason as { stack?: unknown }).stack === 'string'
      ? (reason as { stack: string }).stack
      : undefined

    return stack ?? message
  }

  return undefined
}

export const isExtensionRelatedErrorEvent = (event: ErrorEvent) => {
  const { filename, message, error } = event
  const candidates = [filename, error?.stack, error?.message]

  const hasExtensionSource = candidates.some((candidate) => typeof candidate === 'string' && isExtensionSource(candidate))

  if (hasExtensionSource) {
    return true
  }

  return isReactInvariant(message) && candidates.some((candidate) => typeof candidate === 'string' && isExtensionSource(candidate))
}

export const isExtensionRelatedReason = (reason: unknown) => {
  const reasonString = extractReasonString(reason)
  return typeof reasonString === 'string' && isExtensionSource(reasonString)
}

export const isExtensionError = (error: Error) => {
  const stack = error.stack ?? ''
  const message = error.message ?? ''

  if (EXTENSION_ERROR_PATTERNS.some((pattern) => stack.includes(pattern) || message.includes(pattern))) {
    return true
  }

  if (message.includes(REACT_INVARIANT_MARKER)) {
    return EXTENSION_ERROR_PATTERNS.some((pattern) => stack.includes(pattern))
  }

  return false
}
