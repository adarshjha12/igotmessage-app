import withPWA from 'next-pwa';

const baseConfig = {
  reactStrictMode: true,
 };

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [/app-build-manifest\.json$/],
  runtimeCaching: [
    {
      // Static assets
      urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        cacheableResponse: {
          statuses: [0, 200],
        },
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: /^\/dash\/.*$/i,
      handler: 'StaleWhileRevalidate', // or 'NetworkFirst' if dynamic
      options: {
        cacheName: 'dashboard-pages',
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 12},
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // HTML pages (routes)
      urlPattern: /^\/.*$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'page-cache',
        cacheableResponse: {
          statuses: [0, 200],
        },
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      // API
      urlPattern: /^https:\/\/igotmessage-app-backend\.onrender\.com\/api\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        cacheableResponse: {
          statuses: [0, 200],
        },
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 5 },
      },
    },
  ]
  
})(baseConfig);

export default nextConfig;
