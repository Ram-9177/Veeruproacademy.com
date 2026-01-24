"""
Custom security middleware for Veeru's Pro Academy.
"""
import time
from django.http import HttpResponseForbidden
from django.conf import settings


class SecurityHeadersMiddleware:
    """Add additional security headers to all responses."""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Content Security Policy - allow Tailwind CDN and other necessary resources
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; "
            "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; "
            "img-src 'self' data: https: blob: https://images.unsplash.com; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "form-action 'self'; "
            "base-uri 'self';"
        )
        response['Content-Security-Policy'] = csp
        
        # Permissions Policy (formerly Feature-Policy)
        response['Permissions-Policy'] = (
            "geolocation=(), "
            "microphone=(), "
            "camera=(), "
            "payment=(), "
            "usb=()"
        )
        
        # Additional security headers
        response['X-Permitted-Cross-Domain-Policies'] = 'none'
        response['Cross-Origin-Embedder-Policy'] = 'unsafe-none'
        response['Cross-Origin-Opener-Policy'] = 'same-origin'
        response['Cross-Origin-Resource-Policy'] = 'same-origin'
        
        return response


class RateLimitMiddleware:
    """Simple in-memory rate limiting for critical endpoints."""
    
    # Rate limit: requests per minute
    RATE_LIMITS = {
        '/login/': 10,
        '/signup/': 5,
        '/api/': 60,
    }
    
    # Maximum keys to store (prevents memory leak)
    MAX_KEYS = 10000
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.requests = {}  # key -> list of timestamps
    
    def __call__(self, request):
        # Skip rate limiting in DEBUG mode
        if getattr(settings, 'DEBUG', False):
            return self.get_response(request)
        
        # Check if path should be rate limited
        path = request.path
        limit = None
        for prefix, rate in self.RATE_LIMITS.items():
            if path.startswith(prefix):
                limit = rate
                break
        
        if limit is None:
            return self.get_response(request)
        
        # Get client IP
        ip = self.get_client_ip(request)
        key = f"{ip}:{path}"
        now = time.time()
        
        # Clean old requests (older than 1 minute)
        if key in self.requests:
            self.requests[key] = [t for t in self.requests[key] if now - t < 60]
        else:
            self.requests[key] = []
        
        # Periodic cleanup to prevent memory growth
        if len(self.requests) > self.MAX_KEYS:
            self._cleanup_old_entries(now)
        
        # Check rate limit
        if len(self.requests[key]) >= limit:
            return HttpResponseForbidden(
                '<h1>Too Many Requests</h1>'
                '<p>You have exceeded the rate limit. Please try again later.</p>',
                content_type='text/html'
            )
        
        # Record this request
        self.requests[key].append(now)
        
        return self.get_response(request)
    
    def _cleanup_old_entries(self, now):
        """Remove stale entries to prevent unbounded memory growth."""
        keys_to_delete = []
        for key, timestamps in self.requests.items():
            # Remove entries with no recent requests
            if not timestamps or (now - max(timestamps)) > 120:
                keys_to_delete.append(key)
        for key in keys_to_delete:
            del self.requests[key]
    
    def get_client_ip(self, request):
        # Prefer trusted proxy headers (Cloudflare/Vercel) when present.
        # Note: Always validate ALLOWED_HOSTS and keep HTTPS enabled in production.
        for header in (
            'HTTP_CF_CONNECTING_IP',
            'HTTP_TRUE_CLIENT_IP',
            'HTTP_X_REAL_IP',
        ):
            value = request.META.get(header)
            if value:
                return value.strip()

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # First IP is the original client.
            return x_forwarded_for.split(',')[0].strip()

        return (request.META.get('REMOTE_ADDR') or '').strip()
