import withPWA from 'next-pwa';

const baseConfig = {
  reactStrictMode: true,
 };

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/app-build-manifest\.json$/],
  runtimeCaching: [
    {
      // Static assets
      urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // HTML pages (routes)
      urlPattern: /^\/.*$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'page-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      // API
      urlPattern: /^https:\/\/igotmessage-app-backend\.onrender\.com\/api\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 5 },
      },
    },
  ]
  
})(baseConfig);

export default nextConfig;
