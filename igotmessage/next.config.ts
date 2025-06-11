import withPWA from 'next-pwa';

const baseConfig = {
  reactStrictMode: true,
 };

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(baseConfig);

export default nextConfig;
