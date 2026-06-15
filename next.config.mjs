/** @type {import('next').NextConfig} */
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: "true",
});

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
    cpus: 5,
    optimizePackageImports: [
      "lucide-react",
    ],
  },
  allowedDevOrigins: ['192.168.88.62'],
};

export default withBundleAnalyzer(nextConfig);
