/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/cloud-devops', destination: '/cloud-and-devops', permanent: true },
      { source: '/cloud-devops/:path*', destination: '/cloud-and-devops/:path*', permanent: true },
      { source: '/testing-qa', destination: '/testing-and-qa', permanent: true },
      { source: '/testing-qa/:path*', destination: '/testing-and-qa/:path*', permanent: true },
      { source: '/blockchain-web3', destination: '/blockchain-and-web3', permanent: true },
      { source: '/blockchain-web3/:path*', destination: '/blockchain-and-web3/:path*', permanent: true },
      { source: '/support-outsourcing', destination: '/support-and-outsourcing', permanent: true },
      { source: '/support-outsourcing/:path*', destination: '/support-and-outsourcing/:path*', permanent: true },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'www.magnific.com',
      }
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
    ],
  },
  allowedDevOrigins: ['192.168.88.36'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com https://img.icons8.com https://cdn.jsdelivr.net https://i.pravatar.cc https://upload.wikimedia.org https://www.transparenttextures.com; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
