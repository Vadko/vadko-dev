// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vadko.dev',
  vite: {
    plugins: [tailwindcss()]
  }
});

/**
 * ============================================
 * SECURITY HEADERS RECOMMENDATION
 * ============================================
 * 
 * Add these headers in your hosting provider (Vercel, Netlify, Cloudflare) or _headers file:
 * 
 * Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';
 * X-Content-Type-Options: nosniff
 * X-Frame-Options: DENY
 * X-XSS-Protection: 1; mode=block
 * Referrer-Policy: strict-origin-when-cross-origin
 * Permissions-Policy: camera=(), microphone=(), geolocation=()
 * Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
 * 
 * For Vercel, add to vercel.json:
 * {
 *   "headers": [
 *     {
 *       "source": "/(.*)",
 *       "headers": [
 *         { "key": "X-Content-Type-Options", "value": "nosniff" },
 *         { "key": "X-Frame-Options", "value": "DENY" },
 *         { "key": "X-XSS-Protection", "value": "1; mode=block" },
 *         { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
 *       ]
 *     }
 *   ]
 * }
 * 
 * For Netlify, create public/_headers:
 * /*
 *   X-Content-Type-Options: nosniff
 *   X-Frame-Options: DENY
 *   X-XSS-Protection: 1; mode=block
 *   Referrer-Policy: strict-origin-when-cross-origin
 * 
 * ============================================
 */
