import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 1. Images Configuration (Sahi Domains)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "workspace.com.pk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Yeh bilkul sahi format hai
        pathname: "/**",
      }
    ],
  },

  // 2. Aapke Existing Secure Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          }
        ],
      },
    ]
  },
}

import { withSentryConfig } from "@sentry/nextjs"

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "lumina-chairs",
  project: "chair-store",
})
