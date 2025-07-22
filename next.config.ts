/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add other domains if needed
    ],
  },
  transpilePackages: ['openid-client'], // <-- moved outside remotePatterns
};

module.exports = nextConfig;
