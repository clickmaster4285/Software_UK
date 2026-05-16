/** @type {import('next').NextConfig} */
const nextConfig = {
  // have to allow image from https://img.icons8.com
  images: {
    remotePatterns: [
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
  allowedDevOrigins: ['192.168.88.62'],
};

export default nextConfig;
