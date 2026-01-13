import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
      preventFullImport: true,
    },
  },
  async headers() {
    return isProd
      ? [
          {
            source: '/(.*)',
            headers: [
              { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
              { key: 'X-Frame-Options', value: 'DENY' },
              { key: 'X-Content-Type-Options', value: 'nosniff' },
              { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
              { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), vr=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), clipboard-read=(), clipboard-write=(self), gyroscope=(), magnetometer=(), midi=()' },
              { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
              { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
              { key: 'X-DNS-Prefetch-Control', value: 'off' },
              {
                key: 'Content-Security-Policy',
                value: [
                  "default-src 'self'",
                  "script-src 'self' 'unsafe-inline' https://plausible.io https://unpkg.com https://cdn.jsdelivr.net",
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                  "img-src 'self' data: https:",
                  "font-src 'self' https://fonts.gstatic.com",
                  "connect-src 'self' https://plausible.io https://unpkg.com https://cdn.jsdelivr.net https://uploadthing.com https://utfs.io",
                  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
                  "frame-ancestors 'none'",
                  "base-uri 'self'",
                  "form-action 'self'",
                  'upgrade-insecure-requests',
                ].join('; '),
              },
            ],
          },
        ]
      : []
  },
  
  // Configure webpack
  webpack: (config, { isServer: _isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
      '@/components': [path.resolve(__dirname, 'components'), path.resolve(__dirname, 'app/components')],
      '@/app': path.resolve(__dirname, 'app'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/src': path.resolve(__dirname, 'src'),
    };
        // Configure webpack cache to prevent serialization errors
    config.cache = false;
    
    // Important: return the modified config
    return config;
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Configure images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'veerupro.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
