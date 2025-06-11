import type { NextConfig } from "next";
import withPwa from 'next-pwa'


const nextConfig: NextConfig = {
  /* config options here */
};

const withPWAConfig = withPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable in dev
})(nextConfig);

export default withPWAConfig
