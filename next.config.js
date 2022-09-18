/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching: require('next-pwa/cache')
});

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

const nextConfig = defineNextConfig({
  eslint: {
    dirs: ['.']
  },
  images: { domains: ['play.pokemonshowdown.com'] },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: false
});

module.exports = withBundleAnalyzer(withPWA(nextConfig));
