/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The résumé used to be a static file. Phase 18 replaced it with a route
  // generated from canonical data, and any copy of the old link — including one
  // already sent with an application — still has to resolve.
  async redirects() {
    return [{ source: "/resume.html", destination: "/resume", permanent: true }];
  },

  // Conservative security headers (no CSP — avoids breaking Next's inline
  // styles/scripts). Applied by the Next/Vercel server.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
