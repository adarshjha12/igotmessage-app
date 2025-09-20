import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    devIndicators: false,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
        pathname: '/**'
      },
    ],
  },
}

export default nextConfig